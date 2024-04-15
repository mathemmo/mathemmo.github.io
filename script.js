const SKILL_IDS = ["arithmetics", "algebra", "geometry", "functions", "calculus"]
const SKILL_NAMES = {
  arithmetics: "Arithmetics",
  algebra: "Algebra",
  geometry: "Geometry",
  functions: "Functions",
  calculus: "Calculus",
}
const STAT_IDS = ["health", "mana", "strength"]

const LOCAITON_IDS = ["arithmetics", "algebra", "geometry", "functions", "calculus"]
const RESOURCE_IDS = ["number_wood", "fraction_stone"]
const MOB_IDS = ["summing_serpent", "subtraction_salamander", "multiplication_mantis", "division_dove"]
const NPC_IDS = ["integer_instructor", "floating_point_professor"]


var links = document.querySelectorAll(".subpage-button")
var subpages = document.querySelectorAll(".subpage")

function hideAllSubpages() {
  subpages.forEach(subpage => subpage.style.display = "none")
}

function showSubpage(id) {
  var subpage = document.querySelector(id)
  if (subpage) {
    subpage.style.display = "block"
  }
}

links.forEach(link => {
  link.addEventListener("click", function(event) {
    event.preventDefault()
    hideAllSubpages()
    showSubpage(`#${this.getAttribute("data-target")}`)
  });
});

hideAllSubpages();
showSubpage("#menu");


class Item {
  constructor(name, description, quantity = 1) {
    this.name = name;
    this.description = description;
    this.quantity = quantity;
  }
}

class GameData {
  constructor(profile = {
    health: 100,
    mana: 100,
    strength: 10,
    skills: {
      arithmetics: 0,
      algebra: 0,
      geometry: 0,
      functions: 0,
      calculus: 0,
    },
    inventory: [], // Changed to an array of items
  }) {
    this.profile = profile;
  }

  load() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('gameData='));
    if (cookie) {
      this.profile = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    }
  }

  save() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `gameData=${encodeURIComponent(JSON.stringify(this.profile))}; expires=${date.toUTCString()}; path=/`;
  }

  updateHtml() {
    STAT_IDS.forEach(stat => {
      var statCell = document.getElementById(`${stat}-value`);
      var value = this.profile[stat];
      statCell.textContent = value;
    });

    SKILL_IDS.forEach(skill => {
      var skillBar = document.getElementById(`skill-${skill}`);
      var xp = this.profile.skills[skill];
      var level = Math.floor(xp / 100);
      var progress = xp % 100;
      skillBar.querySelector(".skill-level").style.width = `${progress}%`;
      var displayName = SKILL_NAMES[skill];
      skillBar.querySelector(".skill-level").textContent = (level > 0) ? `${displayName} ${level}` : displayName;
    });

    var inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    this.profile.inventory.forEach(item => {
      var listItem = document.createElement('li');
      listItem.textContent = item;
      inventoryList.appendChild(listItem);
    });
  }
}

const gameData = new GameData();
gameData.load();
gameData.updateHtml();
