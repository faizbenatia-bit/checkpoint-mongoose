const mongoose = require("mongoose");

// Création du schema Person
const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    age: {
      type: Number,
      min: 0
    },

    favoriteFoods: {
      type: [String],
      default: []
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },

    gender: {
      type: String,
      enum: ["male", "female"]
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// ======================================================
// 15. VIRTUAL PROPERTY : ageCategory
// ======================================================

personSchema.virtual("ageCategory").get(function () {
  if (this.age < 13) {
    return "Child";
  } else if (this.age <= 17) {
    return "Teenager";
  } else if (this.age <= 59) {
    return "Adult";
  } else {
    return "Senior";
  }
});


// ======================================================
// 16. VIRTUAL PROPERTY : initials
// ======================================================

personSchema.virtual("initials").get(function () {
  return this.name
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("");
});


// ======================================================
// 17. INSTANCE METHOD : removeFavoriteFood
// ======================================================

personSchema.methods.removeFavoriteFood = async function (food) {

  this.favoriteFoods = this.favoriteFoods.filter(
    item => item.toLowerCase() !== food.toLowerCase()
  );

  return await this.save();
};


// ======================================================
// 18. STATIC METHOD : findAdults
// ======================================================

personSchema.statics.findAdults = function (gender) {

  return this.find({
    age: { $gte: 18 },
    gender: gender
  }).sort({
    age: -1
  });
};


// ======================================================
// 19. PRE-SAVE MIDDLEWARE
// ======================================================

personSchema.pre("save", function (next) {

  if (this.isModified("name")) {

    this.name = this.name
      .trim()
      .split(/\s+/)
      .map(word => {
        return word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  next();
});


// Création et export du modèle Person
const Person = mongoose.model("Person", personSchema);

module.exports = Person;