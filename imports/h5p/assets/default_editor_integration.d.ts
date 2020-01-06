export declare const filesPath: string;
export declare namespace fileIcon {
    export const path: string;
    export const width: number;
    export const height: number;
}
export declare const ajaxPath: string;
export declare const libraryUrl: string;
export declare const copyrightSemantics: {
    "name": string;
    "type": string;
    "label": string;
    "fields": ({
        "name": string;
        "type": string;
        "label": string;
        "placeholder": string;
        "optional": boolean;
        "regexp"?: undefined;
        "default"?: undefined;
        "options"?: undefined;
    } | {
        "name": string;
        "type": string;
        "label": string;
        "placeholder": string;
        "optional": boolean;
        "regexp": {
            "pattern": string;
            "modifiers": string;
        };
        "default"?: undefined;
        "options"?: undefined;
    } | {
        "name": string;
        "type": string;
        "label": string;
        "default": string;
        "options": ({
            "value": string;
            "label": string;
            "versions"?: undefined;
        } | {
            "value": string;
            "label": string;
            "versions": {
                "value": string;
                "label": string;
            }[];
        })[];
        "placeholder"?: undefined;
        "optional"?: undefined;
        "regexp"?: undefined;
    } | {
        "name": string;
        "type": string;
        "label": string;
        "options": any[];
        "placeholder"?: undefined;
        "optional"?: undefined;
        "regexp"?: undefined;
        "default"?: undefined;
    })[];
};
export declare const metadataSemantics: ({
    "name": string;
    "type": string;
    "label": string;
    "placeholder": string;
    "default"?: undefined;
    "options"?: undefined;
    "optional"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "label": string;
    "default": string;
    "options": ({
        "value": string;
        "label": string;
        "type"?: undefined;
        "options"?: undefined;
    } | {
        "type": string;
        "label": string;
        "options": ({
            "value": string;
            "label": string;
            "versions": {
                "value": string;
                "label": string;
            }[];
        } | {
            "value": string;
            "label": string;
            "versions"?: undefined;
        })[];
        "value"?: undefined;
    })[];
    "placeholder"?: undefined;
    "optional"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "label": string;
    "options": {
        "value": string;
        "label": string;
    }[];
    "optional": boolean;
    "placeholder"?: undefined;
    "default"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "label": string;
    "placeholder": string;
    "min": string;
    "max": string;
    "optional": boolean;
    "default"?: undefined;
    "options"?: undefined;
    "field"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "label": string;
    "placeholder": string;
    "optional": boolean;
    "default"?: undefined;
    "options"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "field": {
        "name": string;
        "type": string;
        "fields": ({
            "label": string;
            "name": string;
            "optional": boolean;
            "type": string;
            "default"?: undefined;
            "options"?: undefined;
        } | {
            "name": string;
            "type": string;
            "label": string;
            "default": string;
            "options": {
                "value": string;
                "label": string;
            }[];
            "optional"?: undefined;
        })[];
        "label"?: undefined;
    };
    "label"?: undefined;
    "placeholder"?: undefined;
    "default"?: undefined;
    "options"?: undefined;
    "optional"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "widget": string;
    "label": string;
    "optional": boolean;
    "description": string;
    "placeholder"?: undefined;
    "default"?: undefined;
    "options"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
} | {
    "name": string;
    "type": string;
    "field": {
        "name": string;
        "type": string;
        "label": string;
        "fields": ({
            "name": string;
            "type": string;
            "label": string;
            "optional": boolean;
            "widget"?: undefined;
            "placeholder"?: undefined;
        } | {
            "name": string;
            "type": string;
            "widget": string;
            "label": string;
            "placeholder": string;
            "optional": boolean;
        })[];
    };
    "label"?: undefined;
    "placeholder"?: undefined;
    "default"?: undefined;
    "options"?: undefined;
    "optional"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "widget"?: undefined;
    "description"?: undefined;
} | {
    "name": string;
    "type": string;
    "widget": string;
    "label"?: undefined;
    "placeholder"?: undefined;
    "default"?: undefined;
    "options"?: undefined;
    "optional"?: undefined;
    "min"?: undefined;
    "max"?: undefined;
    "field"?: undefined;
    "description"?: undefined;
})[];
export declare namespace assets {
    export const css: any[];
    export const js: any[];
}
export declare const deleteMessage: string;
