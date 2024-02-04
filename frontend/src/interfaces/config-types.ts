export interface Config {
    [key: string]: {
        realEstate: {
            address: string;
        };
        escrow: {
            address: string;
        };
    };
}