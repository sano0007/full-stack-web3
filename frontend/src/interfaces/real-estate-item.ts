export interface RealEstateItem {
    name: string;
    address: string;
    description: string;
    image: string;
    id: string;
    attributes: Attribute[];
}

interface Attribute {
    trait_type: string;
    value: string | number;
}
