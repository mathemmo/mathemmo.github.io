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


class Item {
  constructor(name, description, quantity = 1) {
    this.name = name
    this.description = description
    this.quantity = quantity
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
    inventory: [],
  }) {
    this.profile = profile
  }

  // loadCookie() {
  //   const cookie = document.cookie.split('; ').find(row => row.startsWith('gameData='))
  //   if (cookie) {
  //     this.profile = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
  //   }
  // }

  // saveCookie() {
  //   const date = new Date()
  //   date.setFullYear(date.getFullYear() + 1)
  //   document.cookie = `gameData=${encodeURIComponent(JSON.stringify(this.profile))}; expires=${date.toUTCString()}; path=/`
  // }

  updateInventoryHtml() {
    var inventoryList = document.getElementById('inventory-list')
    inventoryList.innerHTML = ''
    if (this.profile.inventory.length === 0) {
      inventoryList.textContent = 'Inventory is empty';
    } else {
      this.profile.inventory.forEach(item => {
      var listItem = document.createElement('li')
      listItem.textContent = item
      inventoryList.appendChild(listItem)
      })
    }
  }

  updateInfoHtml() {
    STAT_IDS.forEach(stat => {
      var statCell = document.getElementById(`${stat}-value`)
      var value = this.profile[stat]
      statCell.textContent = value
    });

    SKILL_IDS.forEach(skill => {
      var skillBar = document.getElementById(`skill-${skill}`)
      var xp = this.profile.skills[skill]
      skillBar.title = `${xp} / 10000 XP`
      var level = Math.floor(xp / 100)
      var progress = xp % 100
      var skillLevel = skillBar.querySelector(".skill-level")
      skillLevel.style.width = `${progress}%`
      var displayName = SKILL_NAMES[skill]
      skillLevel.textContent = (level > 0) ? `${displayName} ${level}` : displayName
    });

    var inventoryList = document.getElementById('inventory-list')
    inventoryList.innerHTML = ''
    this.profile.inventory.forEach(item => {
      var listItem = document.createElement('li')
      listItem.textContent = item
      inventoryList.appendChild(listItem)
    })
  }
}

function hideAllSubpages() {
  const subpages = document.querySelectorAll(".subpage")
  subpages.forEach(subpage => {
    subpage.style.display = "none"

    // Hide all popups inside the subpage
    const popups = subpage.querySelectorAll(".popup")
    popups.forEach(popup => {
      popup.style.display = "none"
    })
  })
}

function showSubpage(id) {
  var subpage = document.querySelector(id)
  if (subpage) {
    subpage.style.display = "block"
  }
}

function openLoadPopup() {
  const popup = document.getElementById('load-popup')
  popup.style.display = 'block'
}

function closeLoadPopup() {
  const popup = document.getElementById('load-popup')
  popup.style.display = 'none'
}

function showLoadSuccessPopup() {
  const popup = document.getElementById('load-success-popup');
  popup.style.display = 'block';

  setTimeout(function() {
    popup.style.display = 'none';
  }, 5000);
}

function closeLoadSuccessPopup() {
  const popup = document.getElementById('load-success-popup');
  popup.style.display = 'none';
}


hideAllSubpages()
showSubpage("#menu")

document.getElementById('load-json-button').addEventListener('click', function() {
  document.getElementById('load-json-input').click();
  document.getElementById('load-json-input').addEventListener('change', function() {
    const fileNameDisplay = document.getElementById('choose-file-feedback-bar');
    if (this.files.length > 0) {
      fileNameDisplay.textContent = `Selected file: ${this.files[0].name}`;
    } else {
      fileNameDisplay.textContent = 'No file selected';
    }
  });
});

function loadGame() {
  const jsonInput = document.getElementById('load-json-input')
  const file = jsonInput.files[0]
  if (!file) {
    const feedbackBar = document.getElementById("load-feedback-bar")
    const feedbackMessage = document.getElementById("load-feedback-message")
    feedbackMessage.textContent = "No file selected."
    feedbackBar.style.display = "block"
    feedbackBar.style.color = "red"
    return
  }

  const fileReader = new FileReader()
  fileReader.onload = function(event) {
    const data = JSON.parse(event.target.result)
    gameData.profile = data
    gameData.updateInfoHtml()
  }
  fileReader.readAsText(file)

  closeLoadPopup()
  showLoadSuccessPopup()
}

var gameData = new GameData()
gameData.updateInfoHtml()

var links = document.querySelectorAll(".subpage-button")
links.forEach(link => {
  link.addEventListener("click", function(event) {
    event.preventDefault()
    hideAllSubpages()
    showSubpage(`#${this.getAttribute("data-target")}`)

    if (this.getAttribute("data-target") === "info") {
      gameData.updateInfoHtml()
    } else if (this.getAttribute("data-target") === "inventory") {
      gameData.updateInventoryHtml()
    } else if (this.getAttribute("data-target") === "loadsave") {
      const feedbackBar = document.getElementById("load-feedback-bar")
      const feedbackMessage = document.getElementById("load-feedback-message")
      feedbackMessage.textContent = ""
      feedbackBar.style.display = "none"
    }
  })
})

function saveToJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameData.profile))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute("href", dataStr)
  downloadAnchorNode.setAttribute("download", "gameData.json")
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

function loadGameFromFile() {
  // Get the feedback elements
  const feedbackBar = document.getElementById("load-feedback-bar")
  const feedbackMessage = document.getElementById("load-feedback-message")

  // Hide the feedback bar and clear the feedback message
  feedbackBar.style.display = "none"
  feedbackMessage.textContent = ""

  const jsonInput = document.getElementById('json-file-input')
  jsonInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      loadGame(gameData, this.files[0])
    }
  });
  jsonInput.click()
}
