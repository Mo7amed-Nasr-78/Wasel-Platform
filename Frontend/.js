function numFormat(num, label) {
	switch (num) {
		case 1:
			return `${label[0]}`;
		case 2:
			return `${label[1]}`;
		default:
			return `${num} ${label[2]}`;
	}
}

// console.log(numFormat(1, ["صورة", "صورتين", "صور"])); // صورة
// console.log(numFormat(2, ["صورة", "صورتين", "صور"])); // صورتين
// console.log(numFormat(3, ["صورة", "صورتين", "صور"])); // 3 صور

const label_1 = "mohamed.png";
const label_2 = "mohamed.nasr.awad.png";

// console.log(label_1.split(".").splice(label_1.split(".").length - 1, 1)[0]) // png
// console.log(label_1.split(".").slice(0, label_1.split(".").length - 1).join(".")) // mohamed.nasr

const objectData = {
	id: "657c4656-81a1-4d84-b44a-0a3206dcd4e4",
	shipmentId: "load#1733523924",
	origin: "القاهرة",
	destination: "المنيا",
	origin_lat: 0,
	origin_lng: 0,
	destination_lat: 0,
	destination_lng: 0,
	shipmentType: "سيارات",
	packaging: "أكياس نيلون ملفوفة",
	goodsType: "fdsfds",
	description: "fsdfsdfds",
	offerCount: 4,
	weight: 41,
	length: 14,
	width: 14,
	height: 14,
	stacking: null,
	status: "IN_PROGRESS",
	pickupAt: "2026-04-10",
	deliveryAt: "2026-03-14",
	urgent: true,
	additionalInsurance: null,
	twoDrivers: null,
	noFriday: null,
	budgetType: "OPEN_BUDGET",
	suggestedBudget: null,
	paymentType: "ON_DELIVER",
	acceptedOfferId: "34d2032e-3567-4f96-bdc5-770dec701000",
	createAt: "2026-03-22T16:10:46.576Z",
	updatedAt: "2026-03-31T12:02:30.747Z",
	profileId: "12e87cfa-fd08-4910-ba26-4b3e63b5b85c",
	acceptedOffer: {
		id: "34d2032e-3567-4f96-bdc5-770dec701000",
		price: 3000,
		proposal: "\nShipment Price Calculator & Lookup Tool\nI'll build you a fast, accurate shipment pricing system that pulls real-time rates from carriers and presents them cleanly to your customers.",
		status: "ACCEPTED",
		createdAt: "2026-03-31T03:48:33.000Z",
		updatedAt: "2026-03-31T12:02:30.727Z",
		profileId: "9d3bf767-16b9-44c9-a57c-1bfdfa0636db",
		shipmentId: "657c4656-81a1-4d84-b44a-0a3206dcd4e4",
		profile: {
			username: "Mohamed_Nasr",
			first_name: null,
			last_name: null,
			role: "CARRIER_COMPANY",
		},
	},
};

// let mappedObject = {};
// for (let [ key, value ] of Object.entries(objectData)) {
//     if (typeof value === "object") {
//         // continue;
//         mappedObject = { ...mappedObject, ...value }
//     } else {
//         mappedObject[key] = value
//     }
// }

// console.log(mappedObject);

// Recursion
function seriesSummation(num) {
	if (num === 0) return 0;

	return num + seriesSummation(num - 1);
}

const x = {
	objectOne: 1,
	objectTwo: {
		objectTwo: 2,
		objectThree: {
			objectThree: 3,
			objectFour: {
				objectFour: 4,
			},
		},
	},
}; // { objectOne: 1, OnjectTwo: 2, objectThree: 3, objectFour: 4 }

function flatObject(obj, result = {}) {
	for (let [key, value] of Object.entries(obj)) {
		if (
			value !== null &&
			typeof value === "object" &&
			!Array.isArray(value)
		) {
            console.log(key);
			flatObject(value, result);
		} else {
			result[key] = value;
		}
	}
	return result;
}

console.log(flatObject(x));
