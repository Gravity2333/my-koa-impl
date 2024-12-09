function generateMockData() {
  const names = [
    "John",
    "Jane",
    "Tom",
    "Lucy",
    "Mike",
    "Anna",
    "David",
    "Sara",
    "James",
    "Emily",
  ];
  const genders = ["Male", "Female"];
  const professions = [
    "Engineer",
    "Doctor",
    "Teacher",
    "Designer",
    "Developer",
    "Nurse",
    "Artist",
    "Lawyer",
    "Manager",
    "Scientist",
  ];
  const streets = [
    "Main St",
    "Elm St",
    "Maple Ave",
    "Pine Blvd",
    "Oak Dr",
    "Cedar Ln",
    "Birch Way",
    "Rose St",
    "Sunset Blvd",
    "River Rd",
  ];

  function getRandomItem(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const users: {
    id: number;
    name: string;
    age: number;
    address: string;
    gender: string;
    profession: string;
  }[] = [];

  for (let i = 1; i <= 100; i++) {
    const user = {
      id: i,
      name: getRandomItem(names),
      age: Math.floor(Math.random() * (60 - 18 + 1)) + 18, // 18-60岁之间的随机年龄
      address: `${Math.floor(Math.random() * 1000)} ${getRandomItem(streets)}`,
      gender: getRandomItem(genders),
      profession: getRandomItem(professions),
    } as any;

    users.push(user);
  }

  return users;
}

export default generateMockData();
