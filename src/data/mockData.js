
import { themeOptions } from './themeOptions';

export const currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'CEO',
  email: 'ceo@e42.ai',
  avatar: '',
};

export const users = [
  currentUser,
  {
    id: '3',
    name: 'Robert Johnson',
    role: 'Clerk',
    email: 'clerk@e42.ai',
    avatar: '',
  },
];

export const statusTiles = [
  {
    status: 'Received',
    count: 24,
    color: 'blue',
    icon: 'inbox',
  },
  {
    status: 'Approved',
    count: 16,
    color: 'green',
    icon: 'check-circle',
  },
  {
    status: 'Pending',
    count: 8,
    color: 'amber',
    icon: 'clock',
  },
  {
    status: 'Rejected',
    count: 3,
    color: 'red',
    icon: 'x-circle',
  },
];

export const mockInvoices = [
  {
    id: '1',
    uniqueId: '123H893-3304-43af-a2b4-7A252a4e78',
    title: 'Office Supplies',
    poNo: 'NA',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: '# NH-237750',
    invoiceDate: '07/10/2024',
    invoiceDoc: 'T144237341_invoice1_v5.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 1250.75,
    supplierCode: 'SUPPLIER123',
    supplierName: 'MSD SUPPLIES LLC',
    createdAt: '2024-07-01T10:00:00.000Z',
    updatedAt: '2024-07-10T15:30:00.000Z',
    items: [
      { description: 'Paper A4', quantity: 5, rate: 120, amount: 600 },
      { description: 'Pens (Box)', quantity: 2, rate: 150, amount: 300 },
      { description: 'Notebooks', quantity: 7, rate: 50, amount: 350 }
    ]
  },
  {
    id: '2',
    uniqueId: '19c48569-d778-469c-9a5e-a35f37fffe3a',
    title: 'IT Services',
    poNo: 'NA',
    validationStatus: 'Approved',
    validationRemark: 'Approved by CEO',
    invoiceNo: '# DI95548-IN',
    invoiceDate: '02/27/2024',
    invoiceDoc: 'T144209990_invoice2_v2.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 7950.00,
    supplierCode: 'SUPPLIER456',
    supplierName: 'IT RoundPoint',
    createdAt: '2024-02-25T09:15:00.000Z',
    updatedAt: '2024-02-27T11:45:00.000Z',
    items: [
      { description: 'Server Maintenance', quantity: 1, rate: 5000, amount: 5000 },
      { description: 'Software Licenses', quantity: 5, rate: 590, amount: 2950 }
    ]
  },
  {
    id: '3',
    uniqueId: 'd50ae2c3-ccc1-48a8-92dd-dde47ef7f589',
    title: 'Tax Invoice',
    poNo: 'REV 710004456',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: '426127',
    invoiceDate: '03/03/2023',
    invoiceDoc: 'T144209900_Pantone_Invoice_426127.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 432.50,
    supplierCode: 'PANTONE',
    supplierName: 'PANTONE®',
    createdAt: '2023-03-01T08:00:00.000Z',
    updatedAt: '2023-03-03T14:20:00.000Z',
    items: [
      { description: 'Color Guide', quantity: 1, rate: 432.50, amount: 432.50 }
    ]
  },
  {
    id: '4',
    uniqueId: 'bec53a6c-94a5-4ec8-89dd-51e3bc4dd5af',
    title: 'Hardware Supplies',
    poNo: 'NA',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: '435339',
    invoiceDate: '08/28/2023',
    invoiceDoc: 'T144203004_93975321_used.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 567.89,
    supplierCode: 'SIGMA8',
    supplierName: 'SIGMA8',
    createdAt: '2023-08-25T13:10:00.000Z',
    updatedAt: '2023-08-28T09:45:00.000Z',
    items: [
      { description: 'Hardware Kit', quantity: 1, rate: 567.89, amount: 567.89 }
    ]
  },
  {
    id: '5',
    uniqueId: '6235395f-4a02-422d-849f-9b77f59fa16e',
    title: 'Marketing Materials',
    poNo: 'HOTPO0000003',
    validationStatus: 'Rejected',
    validationRemark: 'Price discrepancy',
    invoiceNo: '63428265',
    invoiceDate: '02/26/2024',
    invoiceDoc: 'T144237142_invoice5_v3.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 1120.34,
    supplierCode: 'COPYART',
    supplierName: 'CopyArt',
    createdAt: '2024-02-20T16:30:00.000Z',
    updatedAt: '2024-02-26T10:15:00.000Z',
    items: [
      { description: 'Brochures', quantity: 100, rate: 8.50, amount: 850 },
      { description: 'Business Cards', quantity: 200, rate: 1.35, amount: 270 }
    ]
  },
  {
    id: '6',
    uniqueId: '459a399d-2352-419f-b843-3e0216a6adc',
    title: 'Consulting Services',
    poNo: 'NA',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'FV26005379',
    invoiceDate: '08/10/2024',
    invoiceDoc: 'T144203053_Completed_Invoice_380771-LLAVES-ALTURA-DE-MEXICO-SA-DE-CV-FV26005379-8-10-2023_used.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 2500.00,
    supplierCode: 'AMX',
    supplierName: 'AMX',
    createdAt: '2024-08-05T11:20:00.000Z',
    updatedAt: '2024-08-10T14:50:00.000Z',
    items: [
      { description: 'Business Strategy', quantity: 5, rate: 500, amount: 2500 }
    ]
  },
  {
    id: '7',
    uniqueId: 'f8828a0b-aef5-43db-bd90-26bca54c97',
    title: 'Training Services',
    poNo: 'NA',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'INDU-11010',
    invoiceDate: '04/01/2023',
    invoiceDoc: 'T144208135_INDU-11010_JOHN-KINGS-VILLAGE.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 3450.67,
    supplierCode: 'ECOSAVE',
    supplierName: 'ECOSAVE',
    createdAt: '2023-03-29T09:00:00.000Z',
    updatedAt: '2023-04-01T16:45:00.000Z',
    items: [
      { description: 'Training Session', quantity: 3, rate: 1150, amount: 3450 }
    ]
  },
  {
    id: '8',
    uniqueId: '81282fb-7214-4d75-821e-8456725953',
    title: 'Maintenance Contract',
    poNo: 'NA',
    validationStatus: 'Approved',
    validationRemark: 'Approved by CEO',
    invoiceNo: 'INV-10623',
    invoiceDate: '04/07/2023',
    invoiceDoc: 'T144208136_INV-10623-CP-4AP-CONTROL-VALVES.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 875.42,
    supplierCode: 'ECOSAVE',
    supplierName: 'ECOSAVE',
    createdAt: '2023-04-05T08:30:00.000Z',
    updatedAt: '2023-04-07T13:15:00.000Z',
    items: [
      { description: 'Monthly Maintenance', quantity: 1, rate: 875.42, amount: 875.42 }
    ]
  },
  {
    id: '9',
    uniqueId: 'c87da86c-1535-4d54-93e-8ad5c7e43293',
    title: 'Invoice',
    poNo: '373586',
    validationStatus: 'Approved',
    validationRemark: 'Approved by CEO',
    invoiceNo: 'INV-95625',
    invoiceDate: '03/21/2024',
    invoiceDoc: 'T144209004_Completed_Invoice_LOPEZ-PLATING-AND-SERVICE-SUPPLY-INV-95625-8-21-2023_used.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 5687.99,
    supplierCode: 'LPSUPPLY',
    supplierName: 'Lopez Plating And Service Supply',
    createdAt: '2024-03-18T14:10:00.000Z',
    updatedAt: '2024-03-21T10:30:00.000Z',
    items: [
      { description: 'Plating Services', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Materials', quantity: 1, rate: 1187.99, amount: 1187.99 }
    ]
  },
  {
    id: '10',
    uniqueId: '56569534-3618-4353-b0d5-56a569377f03',
    title: 'Rechnung',
    poNo: '305-6377159-4437934',
    validationStatus: 'Rejected',
    validationRemark: 'Incorrect details',
    invoiceNo: 'PL45A74AXUI',
    invoiceDate: '01/26/2024',
    invoiceDoc: 'T144203004_AmazonBusinessRechnung#ICSH-YLF0-IKPH-(1)_(1)_used.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 189.95,
    supplierCode: 'AMAZONB',
    supplierName: 'amazon business',
    createdAt: '2024-01-24T11:45:00.000Z',
    updatedAt: '2024-01-26T09:20:00.000Z',
    items: [
      { description: 'Office Supplies', quantity: 1, rate: 189.95, amount: 189.95 }
    ]
  },
  // Adding more sample records
  {
    id: '11',
    uniqueId: '78965412-7894-4561-a230-45612378954',
    title: 'Software Licenses',
    poNo: 'PO7894561',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'MS-INV-456789',
    invoiceDate: '07/15/2024',
    invoiceDoc: 'T14425689_Microsoft_Licenses.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 12500.00,
    supplierCode: 'MSFT',
    supplierName: 'Microsoft Corporation',
    createdAt: '2024-07-10T09:30:00.000Z',
    updatedAt: '2024-07-15T14:20:00.000Z',
    items: [
      { description: 'Office 365 Business', quantity: 25, rate: 500, amount: 12500 }
    ]
  },
  {
    id: '12',
    uniqueId: '32145698-7412-8523-9630-74125896301',
    title: 'Cloud Services',
    poNo: 'NA',
    validationStatus: 'Approved',
    validationRemark: 'Approved by CFO',
    invoiceNo: 'AWS-789654',
    invoiceDate: '06/30/2024',
    invoiceDoc: 'T14478965_AWS_Cloud_Services.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 8795.45,
    supplierCode: 'AWS',
    supplierName: 'Amazon Web Services',
    createdAt: '2024-06-25T11:15:00.000Z',
    updatedAt: '2024-06-30T16:45:00.000Z',
    items: [
      { description: 'EC2 Instances', quantity: 1, rate: 5240.25, amount: 5240.25 },
      { description: 'S3 Storage', quantity: 1, rate: 1325.80, amount: 1325.80 },
      { description: 'RDS Services', quantity: 1, rate: 2229.40, amount: 2229.40 }
    ]
  },
  {
    id: '13',
    uniqueId: '85214796-3698-7412-5210-96385214701',
    title: 'Catering Services',
    poNo: 'PO8521479',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'CT-INV-25689',
    invoiceDate: '07/20/2024',
    invoiceDoc: 'T14436589_Catering_Services.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 9850.00,
    supplierCode: 'FOODCO',
    supplierName: 'FoodCo Catering',
    createdAt: '2024-07-18T13:20:00.000Z',
    updatedAt: '2024-07-20T17:10:00.000Z',
    items: [
      { description: 'Corporate Event Catering', quantity: 1, rate: 8500, amount: 8500 },
      { description: 'Beverage Service', quantity: 1, rate: 1350, amount: 1350 }
    ]
  },
  {
    id: '14',
    uniqueId: '96325874-1230-4569-8741-85296374102',
    title: 'Office Furniture',
    poNo: 'PO9632587',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'FUR-2589',
    invoiceDate: '07/05/2024',
    invoiceDoc: 'T14474125_Office_Furniture.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 18750.50,
    supplierCode: 'FURNITEC',
    supplierName: 'FurniTech Solutions',
    createdAt: '2024-07-01T10:45:00.000Z',
    updatedAt: '2024-07-05T15:30:00.000Z',
    items: [
      { description: 'Executive Desk', quantity: 2, rate: 4500, amount: 9000 },
      { description: 'Ergonomic Chair', quantity: 5, rate: 1850, amount: 9250 },
      { description: 'Filing Cabinet', quantity: 1, rate: 500.50, amount: 500.50 }
    ]
  },
  {
    id: '15',
    uniqueId: '45612378-9630-1254-7896-32145698701',
    title: 'Marketing Campaign',
    poNo: 'PO4561237',
    validationStatus: 'Rejected',
    validationRemark: 'Budget exceeded',
    invoiceNo: 'MKT-7896',
    invoiceDate: '07/12/2024',
    invoiceDoc: 'T14496325_Marketing_Campaign.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 27500.00,
    supplierCode: 'DIGIMKT',
    supplierName: 'Digital Marketing Pros',
    createdAt: '2024-07-08T09:15:00.000Z',
    updatedAt: '2024-07-12T14:20:00.000Z',
    items: [
      { description: 'Social Media Campaign', quantity: 1, rate: 15000, amount: 15000 },
      { description: 'Content Creation', quantity: 1, rate: 7500, amount: 7500 },
      { description: 'Analytics', quantity: 1, rate: 5000, amount: 5000 }
    ]
  },
  {
    id: '16',
    uniqueId: '78963214-5210-7896-3214-56987412301',
    title: 'Janitorial Services',
    poNo: 'NA',
    validationStatus: 'Approved',
    validationRemark: 'Regular vendor',
    invoiceNo: 'CLN-4569',
    invoiceDate: '07/25/2024',
    invoiceDoc: 'T14463254_Cleaning_Services.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 4500.00,
    supplierCode: 'CLEANPRO',
    supplierName: 'CleanPro Services',
    createdAt: '2024-07-20T08:30:00.000Z',
    updatedAt: '2024-07-25T13:10:00.000Z',
    items: [
      { description: 'Monthly Office Cleaning', quantity: 1, rate: 4500, amount: 4500 }
    ]
  },
  {
    id: '17',
    uniqueId: '36985214-7012-3698-5214-70123698501',
    title: 'IT Hardware',
    poNo: 'PO3698521',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'TECH-8521',
    invoiceDate: '07/18/2024',
    invoiceDoc: 'T14489652_IT_Hardware.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 86500.75,
    supplierCode: 'TECHSUP',
    supplierName: 'Tech Supplies Ltd',
    createdAt: '2024-07-15T11:45:00.000Z',
    updatedAt: '2024-07-18T16:35:00.000Z',
    items: [
      { description: 'Laptops', quantity: 5, rate: 12500, amount: 62500 },
      { description: 'Monitors', quantity: 8, rate: 2500, amount: 20000 },
      { description: 'Wireless Keyboards', quantity: 10, rate: 400, amount: 4000 }
    ]
  },
  {
    id: '18',
    uniqueId: '12305698-7412-1230-5698-74121230501',
    title: 'Legal Services',
    poNo: 'NA',
    validationStatus: 'Approved',
    validationRemark: 'Approved by Legal Dept',
    invoiceNo: 'LGL-6398',
    invoiceDate: '07/08/2024',
    invoiceDoc: 'T14452143_Legal_Services.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 12500.00,
    supplierCode: 'LEGALCO',
    supplierName: 'Legal Consultants Inc',
    createdAt: '2024-07-05T14:20:00.000Z',
    updatedAt: '2024-07-08T17:10:00.000Z',
    items: [
      { description: 'Contract Review', quantity: 5, rate: 1500, amount: 7500 },
      { description: 'Legal Consultation', quantity: 10, rate: 500, amount: 5000 }
    ]
  },
  {
    id: '19',
    uniqueId: '98745632-1058-9874-5632-10589874501',
    title: 'Training Workshop',
    poNo: 'PO9874563',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'TR-7821',
    invoiceDate: '07/22/2024',
    invoiceDoc: 'T14465874_Training_Workshop.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 35000.00,
    supplierCode: 'TRAININC',
    supplierName: 'Training Incorporated',
    createdAt: '2024-07-20T09:45:00.000Z',
    updatedAt: '2024-07-22T14:15:00.000Z',
    items: [
      { description: 'Leadership Workshop', quantity: 1, rate: 25000, amount: 25000 },
      { description: 'Training Materials', quantity: 20, rate: 500, amount: 10000 }
    ]
  },
  {
    id: '20',
    uniqueId: '65478932-1052-6547-8932-10526547801',
    title: 'Office Supplies',
    poNo: 'PO6547893',
    validationStatus: 'Pending',
    validationRemark: '',
    invoiceNo: 'SUP-4587',
    invoiceDate: '07/30/2024',
    invoiceDoc: 'T14478945_Office_Supplies.pdf',
    invoiceCurrency: 'INR',
    invoiceValue: 8750.45,
    supplierCode: 'OFFICEDEP',
    supplierName: 'Office Depot',
    createdAt: '2024-07-28T10:30:00.000Z',
    updatedAt: '2024-07-30T15:20:00.000Z',
    items: [
      { description: 'Printer Paper', quantity: 20, rate: 250, amount: 5000 },
      { description: 'Ink Cartridges', quantity: 5, rate: 650, amount: 3250 },
      { description: 'Office Stationery', quantity: 1, rate: 500.45, amount: 500.45 }
    ]
  },
];

export const monthOptions = [
  { id: 'all', label: 'All Months', value: 'all' },
  { id: '01', label: 'January', value: '01' },
  { id: '02', label: 'February', value: '02' },
  { id: '03', label: 'March', value: '03' },
  { id: '04', label: 'April', value: '04' },
  { id: '05', label: 'May', value: '05' },
  { id: '06', label: 'June', value: '06' },
  { id: '07', label: 'July', value: '07' },
  { id: '08', label: 'August', value: '08' },
  { id: '09', label: 'September', value: '09' },
  { id: '10', label: 'October', value: '10' },
  { id: '11', label: 'November', value: '11' },
  { id: '12', label: 'December', value: '12' },
];

export const quarterOptions = [
  { id: 'all', label: 'All Quarters', value: 'all' },
  { id: 'Q1', label: 'Q1 (Jan-Mar)', value: 'Q1' },
  { id: 'Q2', label: 'Q2 (Apr-Jun)', value: 'Q2' },
  { id: 'Q3', label: 'Q3 (Jul-Sep)', value: 'Q3' },
  { id: 'Q4', label: 'Q4 (Oct-Dec)', value: 'Q4' },
];

export const yearOptions = [
  { id: 'all', label: 'All Years', value: 'all' },
  { id: '2024', label: '2024', value: '2024' },
  { id: '2023', label: '2023', value: '2023' },
  { id: '2022', label: '2022', value: '2022' },
];

export const vendorOptions = [
  { id: 'all', label: 'All Vendors', value: 'all' },
  ...Array.from(new Set(mockInvoices.map(invoice => invoice.supplierName)))
    .map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      label: name,
      value: name,
    })),
];

export { themeOptions };
