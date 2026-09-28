const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// ======================================================
// IMPORTATIONS
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Person = require("./models/Person");

const app = express();


// ======================================================
// CONFIGURATION
// ======================================================

const PORT = process.env.PORT || 3000;
app.use(express.json());


// ======================================================
// CONNEXION À MONGODB
// ======================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// ======================================================
// 3. CREATE ONE PERSON
// ======================================================

async function createPerson() {

  try {

    const person = new Person({
      name: "Jane Doe",
      age: 23,
      favoriteFoods: [
        "pizza",
        "salad",
        "pasta"
      ],
      email: "jane@example.com",
      gender: "female"
    });

    const savedPerson = await person.save();

    console.log("Created person:");
    console.log(savedPerson);

    return savedPerson;

  } catch (error) {
    console.error(error);
  }
}

//createPerson();

// ======================================================
// 4. CREATE MANY PEOPLE
// ======================================================

async function createManyPeople(arrayOfPeople) {

  try {

    const people = await Person.insertMany(arrayOfPeople);

    console.log("Created people:");
    console.log(people);

    return people;

  } catch (error) {
    console.error(error);
  }
}

const arrayOfPeople = [
  {
    name: "John Doe",
    age: 25,
    favoriteFoods: ["pizza", "hamburger", "pasta"],
    email: "john@example.com",
    gender: "male"
  },
  {
    name: "Mary Smith",
    age: 30,
    favoriteFoods: ["burritos", "tacos", "salad"],
    email: "mary@example.com",
    gender: "female"
  },
  {
    name: "Ahmed Ben Ali",
    age: 22,
    favoriteFoods: ["couscous", "pizza", "burritos"],
    email: "ahmed@example.com",
    gender: "male"
  },
  {
    name: "Sarah Johnson",
    age: 27,
    favoriteFoods: ["pasta", "salad", "sushi"],
    email: "sarah@example.com",
    gender: "female"
  },
  {
    name: "Michael Brown",
    age: 35,
    favoriteFoods: ["hamburger", "fries", "pizza"],
    email: "michael@example.com",
    gender: "male"
  },
  {
    name: "Emma Wilson",
    age: 24,
    favoriteFoods: ["burritos", "pizza", "tacos"],
    email: "emma@example.com",
    gender: "female"
  },
  {
    name: "John Miller",
    age: 29,
    favoriteFoods: ["burritos", "steak", "fries"],
    email: "john2@example.com",
    gender: "male"
  },
  {
    name: "David Anderson",
    age: 31,
    favoriteFoods: ["sushi", "ramen", "pizza"],
    email: "david@example.com",
    gender: "male"
  },
  {
    name: "Sophia Taylor",
    age: 21,
    favoriteFoods: ["salad", "pasta", "burritos"],
    email: "sophia@example.com",
    gender: "female"
  },
  {
    name: "Daniel Thomas",
    age: 28,
    favoriteFoods: ["pizza", "hamburger", "burritos"],
    email: "daniel@example.com",
    gender: "male"
  }
];

// createManyPeople(arrayOfPeople);

// ======================================================
// 5. FIND PEOPLE BY NAME
// ======================================================

async function findPeopleByName(personName) {

  try {

    const people = await Person.find({
      name: {
        $regex: personName,
        $options: "i"
      }
    });

    console.log(`People matching "${personName}":`);
    console.log(people);

    return people;

  } catch (error) {
    console.error(error);
  }
}

//findPeopleByName("John");
// ======================================================
// 6. FIND ONE PERSON BY FOOD
// ======================================================

async function findOneByFood(food) {

  try {

    const person = await Person.findOne({
      favoriteFoods: food
    });

    console.log(`Person who likes ${food}:`);
    console.log(person);

    return person;

  } catch (error) {
    console.error(error);
  }
}

//findOneByFood("burritos");
// ======================================================
// 7. FIND PERSON BY ID
// ======================================================

// Méthode 1 : findById()
async function findPersonByIdMethod1(personId) {

  try {

    const person = await Person.findById(personId);

    console.log("Person using findById():");
    console.log(person);

    return person;

  } catch (error) {
    console.error(error);
  }
}


// Méthode 2 : findOne()
async function findPersonByIdMethod2(personId) {

  try {

    const person = await Person.findOne({
      _id: personId
    });

    console.log("Person using findOne():");
    console.log(person);

    return person;

  } catch (error) {
    console.error(error);
  }
}


// Fonction demandée
async function findPersonById(personId) {

  const person1 = await findPersonByIdMethod1(personId);

  const person2 = await findPersonByIdMethod2(personId);

  return {
    method1: person1,
    method2: person2
  };
}

//findPersonById("6aba2fcb41683d75ffa1f779");
// ======================================================
// 8. CLASSIC UPDATE : FIND -> EDIT -> SAVE
// ======================================================

async function addHamburger(personId) {

  try {

    const person = await Person.findById(personId);

    if (!person) {
      console.log("Person not found");
      return null;
    }

    person.favoriteFoods.push("hamburger");

    const updatedPerson = await person.save();

    console.log("Updated person:");
    console.log(updatedPerson);

    return updatedPerson;

  } catch (error) {
    console.error(error);
  }
}

//addHamburger("6aba2fcb41683d75ffa1f779");
// ======================================================
// 9. UPDATE WITH findOneAndUpdate()
// ======================================================

async function updateEmail(personName) {

  try {

    const updatedPerson = await Person.findOneAndUpdate(
      {
        name: personName
      },
      {
        $set: {
          email: "newemail@example.com"
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    console.log("Updated email:");
    console.log(updatedPerson);

    return updatedPerson;

  } catch (error) {
    console.error(error);
  }
}

//updateEmail("John Doe");
// ======================================================
// 10. DELETE ONE PERSON BY ID
// ======================================================

// Méthode 1 : findByIdAndDelete()
async function deletePersonMethod1(personId) {

  try {

    const deletedPerson =
      await Person.findByIdAndDelete(personId);

    console.log("Deleted using findByIdAndDelete():");
    console.log(deletedPerson);

    return deletedPerson;

  } catch (error) {
    console.error(error);
  }
}


// Méthode 2 : findOneAndDelete()
async function deletePersonMethod2(personId) {

  try {

    const deletedPerson =
      await Person.findOneAndDelete({
        _id: personId
      });

    console.log("Deleted using findOneAndDelete():");
    console.log(deletedPerson);

    return deletedPerson;

  } catch (error) {
    console.error(error);
  }
}


// Fonction demandée
async function deletePerson(personId) {

  return await deletePersonMethod1(personId);
}

//deletePerson("6aba2fcb41683d75ffa1f779");
// ======================================================
// 11. DELETE ALL PEOPLE WITH A GIVEN NAME
// ======================================================

async function deletePeopleByName(personName) {

  try {

    const result = await Person.deleteMany({
      name: personName
    });

    console.log("Deleted people:");
    console.log(result);

    return result;

  } catch (error) {
    console.error(error);
  }
}

//deletePeopleByName("John Doe");
// ======================================================
// 12. CHAIN SEARCH QUERY HELPERS
// ======================================================

async function findBurritoLovers() {

  try {

    const people = await Person.find({
      favoriteFoods: "burritos"
    })
      .sort({
        name: 1
      })
      .limit(2)
      .select("-age");

    console.log("Burrito lovers:");
    console.log(people);

    return people;

  } catch (error) {
    console.error(error);
  }
}

//findBurritoLovers();
// ======================================================
// 13. FIND ACTIVE PEOPLE
// ======================================================

async function findActivePeople() {

  try {

    const people = await Person.find({
      isActive: true,
      age: {
        $gte: 18
      }
    })
      .sort({
        age: -1
      })
      .limit(5)
      .select("name age email -_id");

    console.log("Active people:");
    console.log(people);

    return people;

  } catch (error) {
    console.error(error);
  }
}

//findActivePeople();
// ======================================================
// 14. FIND PEOPLE BY GENDER
// ======================================================

async function findPeopleByGender(gender) {

  try {

    const people = await Person.find({
      gender: gender
    });

    console.log(`People with gender ${gender}:`);
    console.log(people);

    return people;

  } catch (error) {
    console.error(error);
  }
}

//findPeopleByGender("female");

// ======================================================
// 17. TEST INSTANCE METHOD
// ======================================================

async function removeFavoriteFood(personId, food) {

  try {

    const person = await Person.findById(personId);

    if (!person) {
      console.log("Person not found");
      return null;
    }

    const updatedPerson =
      await person.removeFavoriteFood(food);

    console.log("Food removed:");
    console.log(updatedPerson);

    return updatedPerson;

  } catch (error) {
    console.error(error);
  }
}

//removeFavoriteFood("6aba310c9eaf06d48c3796d5", "pizza");
// ======================================================
// 18. TEST STATIC METHOD
// ======================================================

async function findAdults(gender) {

  try {

    const adults = await Person.findAdults(gender);

    console.log(`Adults with gender ${gender}:`);
    console.log(adults);

    return adults;

  } catch (error) {
    console.error(error);
  }
}

//findAdults("female");
// ======================================================
// ROUTES EXPRESS
// ======================================================

app.get("/", (req, res) => {

  res.send(`
    <h1>Mongoose People Manager</h1>
    <p>Application running successfully.</p>
  `);

});


