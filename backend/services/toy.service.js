const fs = require("fs");
const gToys = require("../data/toy.json");

function query(filterBy) {
//   var toys = gToys;
//   if (!toys) return Promise.reject("no toys");
//   return Promise.resolve(toys);
    var toys = _filterToys(filterBy);
    return Promise.resolve(toys);
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId);
  return Promise.resolve(toy);
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId);
  if (idx === -1) return Promise.reject("No such toy");
  gToys.splice(idx, 1);
  return _saveToysToFile();
}

function save(toyToSave) {
    if (toyToSave._id) {
      const idx = gToys.findIndex((toy) => toy._id === toyToSave._id);
      if (idx === -1) return Promise.reject('No such toy');
      gToys[idx] = toyToSave;
    } else {
      toyToSave.createdAt = Date.now();
      toyToSave._id = _makeId();
      gToys.unshift(toyToSave);
    }
    return _saveToysToFile().then(() => toyToSave);
}

function _filterToys(filterBy) {
    var toys = gToys;
    let filteredToys = [];
    const regex = new RegExp(filterBy.name, 'i');
    filteredToys = toys.filter((toy) => regex.test(toy.name));
    if (filterBy.inStock) {
        filteredToys = filteredToys.filter((toy) => {
            //   console.log('toy', toy.inStock);
            //   console.log('filterBy.inStock', filterBy.inStock);
            return toy.inStock === JSON.parse(filterBy.inStock);
        });
    }
    if (filterBy.labels.length) {
        filteredToys = filteredToys.filter((toy) => {
            return toy.labels.some((label) => filterBy.labels.includes(label));
        });
    }
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'time')
            filteredToys = filteredToys.sort((t1, t2) => t1.createdAt - t2.createdAt);
        else if (filterBy.sortBy === 'price')
            filteredToys = filteredToys.sort((t1, t2) => t1.price - t2.price);
        else if (filterBy.sortBy === 'name')
            filteredToys = filteredToys.sort((t1, t2) => {
                return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1;
            });
    }

    return filteredToys;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}



function _makeId(length = 5) {
    var txt = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
  }


module.exports = {
    query,
    getById,
    remove,
    save,
  };