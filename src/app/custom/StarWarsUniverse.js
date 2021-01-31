import Entity from './Entity';

export default class StarWarsUniverse {
    constructor() {
        this.entities = [];
        this.init();
    }

    async init() {
        console.log("Start");
        const apiUrl = "https://swapi.booost.bg/api/";
        const rootData = await fetch(apiUrl);
        const jsonRootData = await rootData.json();
        const rootKeys = Object.keys(jsonRootData);

        rootKeys.forEach(async (key) => {
            let dataResponse = await fetch(apiUrl + key);
            let currentData = await dataResponse.json();
            let allEntityData = [];
            allEntityData.push(...currentData.results);

            let pageCounter = 2;
            while (currentData.count !== allEntityData.length) {
                dataResponse = await fetch(apiUrl + key + "/?page=" + pageCounter);

                let currentPageData = await dataResponse.json();
                allEntityData.push(...currentPageData.results);
                pageCounter += 1;
            }

            let currentEntity = new Entity(key, allEntityData);
            this.entities.push(currentEntity);
        })
    }
}