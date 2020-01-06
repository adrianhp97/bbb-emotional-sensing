import { Meteor } from 'meteor/meteor';
import { WebAppInternals } from 'meteor/webapp';
import Langmap from 'langmap';
import fs from 'fs';
import heapdump from 'heapdump';
import Users from '/imports/api/users';
import './settings';
import { lookup as lookupUserAgent } from 'useragent';
import { check } from 'meteor/check';
import memwatch from 'memwatch-next';
import Logger from './logger';
import Redis from './redis';
import setMinBrowserVersions from './minBrowserVersion';
import userLeaving from '/imports/api/users/server/methods/userLeaving';

import bodyParser from 'body-parser';
import child_process from 'child_process';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';

import path from 'path';
import util from 'util';
const exec = util.promisify(child_process.exec);

import index from '../imports/h5p/examples/index';

import examples from '../imports/h5p/examples/examples.json';

import * as h5pLib from 'h5p-nodejs-library';

import DirectoryTemporaryFileStorage from '../imports/h5p/examples/implementation/DirectoryTemporaryFileStorage';
import EditorConfig from '../imports/h5p/examples/implementation/EditorConfig';
import FileContentStorage from '../imports/h5p/examples/implementation/FileContentStorage';
import FileLibraryStorage from '../imports/h5p/examples/implementation/FileLibraryStorage';
import InMemoryStorage from '../imports/h5p/examples/implementation/InMemoryStorage';
import JsonStorage from '../imports/h5p/examples/implementation/JsonStorage';
import User from '../imports/h5p/examples/implementation/User';

const AVAILABLE_LOCALES = fs.readdirSync('assets/app/locales');

Meteor.startup(() => {
  const APP_CONFIG = Meteor.settings.public.app;
  const INTERVAL_IN_SETTINGS = (Meteor.settings.public.pingPong.clearUsersInSeconds) * 1000;
  const INTERVAL_TIME = INTERVAL_IN_SETTINGS < 10000 ? 10000 : INTERVAL_IN_SETTINGS;
  const env = Meteor.isDevelopment ? 'development' : 'production';
  const CDN_URL = APP_CONFIG.cdn;
  let heapDumpMbThreshold = 100;

  const memoryMonitoringSettings = Meteor.settings.private.memoryMonitoring;
  if (memoryMonitoringSettings.stat.enabled) {
    memwatch.on('stats', (stats) => {
      let heapDumpTriggered = false;

      if (memoryMonitoringSettings.heapdump.enabled) {
        heapDumpTriggered = (stats.current_base / 1048576) > heapDumpMbThreshold;
      }
      Logger.info('memwatch stats', { ...stats, heapDumpEnabled: memoryMonitoringSettings.heapdump.enabled, heapDumpTriggered });

      if (heapDumpTriggered) {
        heapdump.writeSnapshot(`./heapdump-stats-${Date.now()}.heapsnapshot`);
        heapDumpMbThreshold += 100;
      }
    });
  }

  if (memoryMonitoringSettings.leak.enabled) {
    memwatch.on('leak', (info) => {
      Logger.info('memwatch leak', info);
    });
  }

  if (CDN_URL.trim()) {
    // Add CDN
    BrowserPolicy.content.disallowEval();
    BrowserPolicy.content.allowInlineScripts();
    BrowserPolicy.content.allowInlineStyles();
    BrowserPolicy.content.allowImageDataUrl(CDN_URL);
    BrowserPolicy.content.allowFontDataUrl(CDN_URL);
    BrowserPolicy.content.allowOriginForAll(CDN_URL);
    WebAppInternals.setBundledJsCssPrefix(CDN_URL + APP_CONFIG.basename);

    const fontRegExp = /\.(eot|ttf|otf|woff|woff2)$/;

    WebApp.rawConnectHandlers.use('/', (req, res, next) => {
      if (fontRegExp.test(req._parsedUrl.pathname)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Vary', 'Origin');
        res.setHeader('Pragma', 'public');
        res.setHeader('Cache-Control', '"public"');
      }
      return next();
    });
  }

  setMinBrowserVersions();

  Meteor.setInterval(() => {
    const currentTime = Date.now();
    Logger.info('Checking for inactive users');
    const users = Users.find({
      connectionStatus: 'online',
      clientType: 'HTML5',
      lastPing: {
        $lt: (currentTime - INTERVAL_TIME), // get user who has not pinged in the last 10 seconds
      },
      loginTime: {
        $lt: (currentTime - INTERVAL_TIME),
      },
    }).fetch();
    if (!users.length) return Logger.info('No inactive users');
    Logger.info('Removing inactive users');
    users.forEach((user) => {
      Logger.info(`Detected inactive user, userId:${user.userId}, meetingId:${user.meetingId}`);
      user.requesterUserId = user.userId;
      return userLeaving(user, user.userId, user.connectionId);
    });
    return Logger.info('All inactive user have been removed');
  }, INTERVAL_TIME);

  Logger.warn(`SERVER STARTED.\nENV=${env},\nnodejs version=${process.version}\nCDN=${CDN_URL}\n`, APP_CONFIG);
});

WebApp.connectHandlers.use('/check', (req, res) => {
  const payload = { html5clientStatus: 'running' };

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(payload));
});

WebApp.connectHandlers.use('/locale', (req, res) => {
  const APP_CONFIG = Meteor.settings.public.app;
  const fallback = APP_CONFIG.defaultSettings.application.fallbackLocale;
  const override = APP_CONFIG.defaultSettings.application.overrideLocale;
  const browserLocale = override ? override.split(/[-_]/g) : req.query.locale.split(/[-_]/g);
  const localeList = [fallback];

  const usableLocales = AVAILABLE_LOCALES
    .map(file => file.replace('.json', ''))
    .reduce((locales, locale) => (locale.match(browserLocale[0])
      ? [...locales, locale]
      : locales), []);

  const regionDefault = usableLocales.find(locale => browserLocale[0] === locale);

  if (regionDefault) localeList.push(regionDefault);
  if (!regionDefault && usableLocales.length) localeList.push(usableLocales[0]);

  let normalizedLocale;
  let messages = {};

  if (browserLocale.length > 1) {
    normalizedLocale = `${browserLocale[0]}_${browserLocale[1].toUpperCase()}`;
    localeList.push(normalizedLocale);
  }

  localeList.forEach((locale) => {
    try {
      const data = Assets.getText(`locales/${locale}.json`);
      messages = Object.assign(messages, JSON.parse(data));
      normalizedLocale = locale;
    } catch (e) {
      Logger.warn(`'Could not process locale ${locale}:${e}`);
      // Getting here means the locale is not available in the current locale files.
    }
  });

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ normalizedLocale, messages }));
});

WebApp.connectHandlers.use('/locales', (req, res) => {
  let locales = [];
  try {
    locales = AVAILABLE_LOCALES
      .map(file => file.replace('.json', ''))
      .map(file => file.replace('_', '-'))
      .map(locale => ({
        locale,
        name: Langmap[locale].nativeName,
      }));
  } catch (e) {
    Logger.warn(`'Could not process locales error: ${e}`);
  }

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(locales));
});

WebApp.connectHandlers.use('/feedback', (req, res) => {
  req.on('data', Meteor.bindEnvironment((data) => {
    const body = JSON.parse(data);
    const {
      meetingId,
      userId,
      authToken,
      userName: reqUserName,
      comment,
      rating,
    } = body;

    check(meetingId, String);
    check(userId, String);
    check(authToken, String);
    check(reqUserName, String);
    check(comment, String);
    check(rating, Number);

    const user = Users.findOne({
      meetingId,
      userId,
      connectionStatus: 'offline',
      authToken,
    });

    if (!user) {
      Logger.warn('Couldn\'t find user for feedback');
    }

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));

    body.userName = user ? user.name : `[unconfirmed] ${reqUserName}`;

    const feedback = {
      ...body,
    };
    Logger.info('FEEDBACK LOG:', feedback);
  }));
});

WebApp.connectHandlers.use('/useragent', (req, res) => {
  const userAgent = req.headers['user-agent'];
  let response = 'No user agent found in header';
  if (userAgent) {
    response = lookupUserAgent(userAgent).toString();
  }

  Logger.info(`The requesting user agent is ${response}`);

  // res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(response);

  const h5pEditor = new h5pLib.H5PEditor(
    new InMemoryStorage(),
    await new EditorConfig(
      new JsonStorage(path.resolve('config.json'))
    ).load(),
    new FileLibraryStorage(path.resolve('h5p/libraries')),
    new FileContentStorage(path.resolve('h5p/content')),
    new h5pLib.TranslationService(h5pLib.englishStrings),
    (library, file) =>
    `${h5pRoute}/libraries/${library.machineName}-${library.majorVersion}.${library.minorVersion}/${file}`,
    new DirectoryTemporaryFileStorage(path.resolve('h5p/temporary-storage'))
  );
  
  const user = new User();
  
  const server = express();
  
  server.use(bodyParser.json());
  server.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  server.use(
    fileUpload({
      limits: {
        fileSize: 50 * 1024 * 1024
      }
    })
  );
  
  const h5pRoute = '/h5p';
  
  server.get(`${h5pRoute}/libraries/:uberName/:file(*)`, async (req, res) => {
    const stream = h5pEditor.libraryManager.getFileStream(
      h5pLib.LibraryName.fromUberName(req.params.uberName),
      req.params.file
    );
    stream.on('end', () => {
      res.end();
    });
    stream.pipe(res.type(path.basename(req.params.file)));
  });
  
  server.get(`${h5pRoute}/content/:id/:file(*)`, async (req, res) => {
    const stream = await h5pEditor.getContentFileStream(
      req.params.id,
      req.params.file,
      user
    );
    stream.on('end', () => {
      res.end();
      stream.close();
    });
    stream.pipe(res.type(path.basename(req.params.file)));
  });
  
  server.get(
    `${h5pEditor.config.temporaryFilesPath}/:file(*)`,
    async (req, res) => {
      const stream = await h5pEditor.getContentFileStream(
        undefined,
        req.params.file,
        user
      );
      stream.on('end', () => {
        res.end();
        stream.close();
      });
      stream.pipe(res.type(path.basename(req.params.file)));
    }
  );
  
  server.use(h5pRoute, express.static(`${path.resolve('')}/h5p`));
  
  server.use('/favicon.ico', express.static(`favicon.ico`));
  
  server.get(`${h5pRoute}/`, (req, res) => {
    fs.readdir('h5p/content', (error, files) => {
      res.end(index({
        contentIds: error ? [] : files,
        examples
      }));
    });
  });
  
  server.get('/play', (req, res) => {
    if (!req.query.contentId) {
      return res.redirect('/');
    }
  
    const libraryLoader = (lib, maj, min) =>
      h5pEditor.libraryManager.loadLibrary(
        new h5pLib.LibraryName(lib, maj, min)
      );
    Promise.all([
      h5pEditor.contentManager.loadContent(
        req.query.contentId,
        new User()
      ),
      h5pEditor.contentManager.loadH5PJson(
        req.query.contentId,
        new User()
      )
    ]).then(([contentObject, h5pObject]) =>
      new h5pLib.H5PPlayer(libraryLoader, {}, null, null, null)
      .render(req.query.contentId, contentObject, h5pObject)
      .then(h5pPage => res.end(h5pPage))
      .catch(error => res.status(500).end(error.message))
    );
  });
  
  server.get('/download', async (req, res) => {
    if (!req.query.contentId) {
      return res.redirect('/');
    }
  
    // set filename for the package with .h5p extension
    res.setHeader(
      'Content-disposition',
      `attachment; filename=${req.query.contentId}.h5p`
    );
    await h5pEditor.exportPackage(req.query.contentId, res, user);
  });
  
  server.get('/examples/:key', (req, res) => {
    const key = req.params.key;
    const name = path.basename(examples[key].h5p);
    const tempPath = path.resolve('scripts/tmp');
    const tempFilename = path.join(tempPath, name);
  
    const libraryLoader = async (lib, maj, min) =>
      h5pEditor.libraryManager.loadLibrary(
        new h5pLib.LibraryName(lib, maj, min)
      );
  
    exec(`sh scripts/download-example.sh ${examples[key].h5p}`)
      .then(async () => {
        const {
          id: contentId
        } = await h5pEditor.packageImporter.addPackageLibrariesAndContent(
          tempFilename,
          new User()
        );
        const h5pObject = await h5pEditor.contentManager.loadH5PJson(
          contentId,
          new User()
        );
        const contentObject = await h5pEditor.contentManager.loadContent(
          contentId,
          new User()
        );
        return new h5pLib.H5PPlayer(
          libraryLoader, {},
          null,
          null,
          ''
        ).render(contentId, contentObject, h5pObject);
      })
      .then(h5pPage => res.end(h5pPage))
      .catch(error => res.status(500).end(error.message))
      .finally(() => {
        fs.unlinkSync(tempFilename);
        fs.rmdirSync(tempPath);
      });
  });
  
  server.get('/edit', async (req, res) => {
    h5pEditor.render(req.query.contentId).then(page => res.end(page));
  });

  server.get('/testing', async (req, res) => {
    h5pEditor.render(req.query.contentId).then(page => res.end(page));
  });
  
  server.get('/params', (req, res) => {
    h5pEditor
      .loadH5P(req.query.contentId)
      .then(content => {
        res.status(200).json(content);
      })
      .catch(() => {
        res.status(404).end();
      });
  });
  
  server.get('/ajax', (req, res) => {
    const {
      action
    } = req.query;
    const {
      majorVersion,
      minorVersion,
      machineName,
      language
    } = req.query;
  
    switch (action) {
      case 'content-type-cache':
        h5pEditor.getContentTypeCache(user).then(contentTypeCache => {
          res.status(200).json(contentTypeCache);
        });
        break;
  
      case 'libraries':
        h5pEditor
          .getLibraryData(
            machineName,
            majorVersion,
            minorVersion,
            language
          )
          .then(library => {
            res.status(200).json(library);
          });
        break;
  
      default:
        res.status(400).end();
        break;
    }
  });
  
  server.post('/edit', (req, res) => {
    h5pEditor
      .saveH5P(
        req.query.contentId,
        req.body.params.params,
        req.body.params.metadata,
        req.body.library,
        user
      )
      .then(() => {
        res.status(200).end();
      });
  });
  
  server.post('/ajax', async (req, res) => {
    const {
      action
    } = req.query;
    switch (action) {
      case 'libraries':
        const libraryOverview = await h5pEditor.getLibraryOverview(
          req.body.libraries
        );
        res.status(200).json(libraryOverview);
        break;
      case 'translations':
        const translationsResponse = await h5pEditor.getLibraryLanguageFiles(
          req.body.libraries,
          req.query.language
        );
        res.status(200).json({
          data: translationsResponse,
          success: true
        });
        break;
      case 'files':
        const uploadFileResponse = await h5pEditor.saveContentFile(
          req.body.contentId === '0' ?
          req.query.contentId :
          req.body.contentId,
          JSON.parse(req.body.field),
          req.files.file,
          user
        );
        res.status(200).json(uploadFileResponse);
        break;
      case 'library-install':
        await h5pEditor.installLibrary(req.query.id, user);
        const contentTypeCache = await h5pEditor.getContentTypeCache(
          user
        );
        res.status(200).json({
          data: contentTypeCache,
          success: true
        });
        break;
      case 'library-upload':
        const {
          metadata, parameters
        } = await h5pEditor.uploadPackage(
          req.files.h5p.data,
          user
        );
        const contentTypes = await h5pEditor.getContentTypeCache(user);
  
        res.status(200).json({
          data: {
            content: parameters,
            contentTypes,
            h5p: metadata
          },
          success: true
        });
        break;
      case 'filter':
        res.status(200).json({
          data: JSON.parse(req.body.libraryParameters),
          success: true
        });
        break;
      default:
        res.status(500).end('NOT IMPLEMENTED');
        break;
    }
  });

  WebApp.connectHandlers.use(Meteor.bindEnvironment(server));
});

export const eventEmitter = Redis.emitter;

export const redisPubSub = Redis;
