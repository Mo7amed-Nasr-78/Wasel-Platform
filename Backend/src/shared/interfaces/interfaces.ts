export interface ShipmentAttachments {
  shipmentImgs: Express.Multer.File[];
  shipmentDocs: Express.Multer.File[];
}

export interface TruckAttachments {
  truck_license_front: Express.Multer.File[];
  truck_license_back: Express.Multer.File[];
  truck_front: Express.Multer.File[];
}

export interface DriverAttachments {
  picture?: Express.Multer.File[];
  license_front?: Express.Multer.File[];
  license_back?: Express.Multer.File[];
  national_id_card_front?: Express.Multer.File[];
  national_id_card_back?: Express.Multer.File[];
}
