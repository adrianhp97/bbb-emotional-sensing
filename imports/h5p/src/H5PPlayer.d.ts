import { ContentId, IContentMetadata, IIntegration, ILibraryLoader } from './types';
export default class H5PPlayer {
    constructor(libraryLoader: ILibraryLoader, urls: {
        baseUrl?: string;
        downloadUrl?: string;
        libraryUrl?: string;
        scriptUrl?: string;
        stylesUrl?: string;
    }, integration: IIntegration, content: any, customScripts?: string);
    private baseUrl;
    private content;
    private customScripts;
    private integration;
    private libraryLoader;
    private libraryUrl;
    private renderer;
    private scriptUrl;
    private stylesUrl;
    private translation;
    private urls;
    coreScripts(): string[];
    coreStyles(): string[];
    generateIntegration(contentId: ContentId, contentObject: any, h5pObject: IContentMetadata): IIntegration;
    render(contentId: ContentId, contentObject: any, h5pObject: IContentMetadata): Promise<string>;
    useRenderer(renderer: any): H5PPlayer;
    private generateDownloadPath;
    private loadAssets;
    private loadLibraries;
    private loadLibrary;
    private mainLibraryString;
}
