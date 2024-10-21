const { createHash } = require("../utils/passwordsHelper");

module.exports.departments = [
  {
    name: "ECE",
    labs: [
      {
        name: "TI Lab",
        lab_incharge: "Mr. XYZ",
        inventories: [
          {
            name: "Digital Storage Oscilloscope of TiLab",
            model: "DSO-X 2012A",
            quantity: 10,
            maker: "Agilent",
            specifications: {
              1: "Channel - 2.5GSa/s",
              2: "Bandwidth - 200MHz",
              3: "Sample Rate - 2GSa/s",
              4: "Functions - Sine, Square, Polse, Triangular, DC & Noise",
              5: "Frequency - 20MHz",
              6: "Voltage - 10Vpp",
            },
          },
          {
            name: "Digital Storage Oscilloscope",
            model: "DSO-X 2012A",
            quantity: 10,
            maker: "Agilent",
            specifications: {
              1: "Channel - 2.5GSa/s",
              2: "Bandwidth - 200MHz",
              3: "Sample Rate - 2GSa/s",
              4: "Functions - Sine, Square, Polse, Triangular, DC & Noise",
              5: "Frequency - 20MHz",
              6: "Voltage - 10Vpp",
            },
          },
        ],
      },
      {
        name: "MicroLab",
        lab_incharge: "Mr. ABC",
        inventories: [
          {
            name: "Digital Storage Oscilloscope of MicroLab",
            model: "DSO-X 2012A",
            quantity: 10,
            maker: "Agilent",
            specifications: {
              1: "Channel - 2.5GSa/s",
              2: "Bandwidth - 200MHz",
              3: "Sample Rate - 2GSa/s",
              4: "Functions - Sine, Square, Polse, Triangular, DC & Noise",
              5: "Frequency - 20MHz",
              6: "Voltage - 10Vpp",
            },
          },
          {
            name: "verilog",
            model: "DSO-X 2012A",
            quantity: 10,
            maker: "Agilent",
            specifications: {
              1: "Channel - 2.5GSa/s",
              2: "Bandwidth - 200MHz",
              3: "Sample Rate - 2GSa/s",
              4: "Functions - Sine, Square, Polse, Triangular, DC & Noise",
              5: "Frequency - 20MHz",
              6: "Voltage - 10Vpp",
            },
          },
        ],
      },
    ],
  },
  {
    name: "CSE",
    labs: [
      {
        name: "CSE Lab",
        lab_incharge: "Mr. XYZ",
      },
      {
        name: "CSE Lab 2",
        lab_incharge: "Mr. ABC",
      },
    ],
  },
];

module.exports.faculties = async () => {
  return [
    {
      name: "Mr. XYZ",
      empId: "ECE-011",
      email: "xyz@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. ABC",
      empId: "ECE-012",
      email: "abc@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. PQR",
      empId: "ECE-013",
      email: "pqr@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. DEF",
      empId: "CSE-014",
      email: "def@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. GHI",
      empId: "CSE-015",
      email: "ghi@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. JKL",
      empId: "CSE-016",
      email: "jkl@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
    {
      name: "Mr. MNO",
      empId: "CSE-017",
      email: "mno@lnmiit.ac.in",
      password: await createHash("123456"),
      mobile: "1234567890",
    },
  ];
};

module.exports.lab_incharge = [
  {
    facultyId: 1,
    labId: 1,
  },
  {
    facultyId: 2,
    labId: 2,
  },
  {
    facultyId: 4,
    labId: 3,
  },
  {
    facultyId: 5,
    labId: 4,
  },
];

module.exports.hods = [
  {
    facultyId: 3,
    departmentId: 1,
  },
  {
    facultyId: 6,
    departmentId: 2,
  },
];
