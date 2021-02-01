import Entity from './Entity';

export default class StarWarsUniverse {
    constructor() {
        this.entities = [];
        return (async () => {
            await this.init();
            return this;
        })();
    }

    async init() {
        let rootKeys;
        const apiUrl = "https://swapi.booost.bg/api/";
        const rootData = await fetch(apiUrl);
        const jsonRootData = await rootData.json();

        rootKeys = Object.keys(jsonRootData);
        await this.getAllData(rootKeys, apiUrl).then((data) => {
            this.entities = data;
        });
    }

    async getAllData(rootKeys, apiUrl) {
        let result = [];
        for (const key of rootKeys) {
            let allEntityData = [];
            let dataResponse = await fetch(apiUrl + key);
            let fetchedData;
            let currentData = await dataResponse.json().then((data) => {
                fetchedData = data;
                allEntityData.push(...data.results);
            });

            let pageCounter = 2;
            while (fetchedData.count !== allEntityData.length) {
                dataResponse = await fetch(apiUrl + key + "/?page=" + pageCounter);

                await dataResponse.json().then((currentPageData) => {
                    allEntityData.push(...currentPageData.results);
                });
                pageCounter += 1;
            }
            let entityData = { count: allEntityData.length, results: allEntityData };
            let currentEntity = new Entity(key, entityData);
            result.push(currentEntity);
        };
        return result;
    }
}