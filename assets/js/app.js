"use strict";

(() => {

    const getData = (url) => fetch(url).then(response => response.json())

    const generateBasicStatsPerCountryTable = countries => {
        const numberOfCountries = countries.length
        const totalCountriesPopulation = countries.reduce((cumulative, current) => cumulative += current.population, 0)
        const averageCountriesPopulation = totalCountriesPopulation / numberOfCountries
        return `
            <tr>
                <td>Total countries result: ${numberOfCountries}</td>
            </tr>
            <tr>
                <td>Total Countries Population: ${totalCountriesPopulation} </td>
            </tr>
            <tr>
                <td>Average Population: ${averageCountriesPopulation} </td>
            </tr>`
    }

    const generatePopulationTable = countries => {
        const populationTableHTML =
            countries
                .map(country => {
                    return `
                    <tr>
                        <td>${country.name.official}</td>
                        <td>${country.population}</td>
                    </tr>`
                })
                .reduce((cumulative, current) => cumulative + current, '')
        return populationTableHTML
    }

    const generateRegionTable = countries => {
        const uniqueRegions = [...new Set(countries.map(country => country.region))]
        console.log(uniqueRegions)
        const regionTableHTML =
            uniqueRegions
                .map(region => {
                    return {
                        region,
                        numberOfCountries: countries.filter(country => region === country.region).length
                    }
                })
                .map(region => {
                    return `
                    <tr>
                        <td>${region.region}</td>
                        <td>${region.numberOfCountries}</td>
                    </tr>
                    `
                })
                .reduce((cumulative, current) => cumulative + current, '')
        return regionTableHTML
    }

    const generateLanguageTable = countries => {
        const languageCount = {};

        // Iterate through all countries and count the languages
        countries.forEach(country => {
            if (country.languages) {
                for (const key in country.languages) { // Iterate over keys in the languages object
                    const language = country.languages[key];
                    languageCount[language] ? languageCount[language] += 1 : languageCount[language] = 1;
                }
            }
        });

        // Create HTML for the language table
        let languageTableHTML = '';
        for (const language in languageCount) {
            languageTableHTML += `
            <tr>
                <td>${language}</td>
                <td>${languageCount[language]}</td>
            </tr>
        `;
        }

        return languageTableHTML;
    };


    const renderBasicStatsPerCountryTable = basicStatsHTML => document.getElementById('basicStatsTable').innerHTML = basicStatsHTML

    const renderPopulationTable = populationTable => document.getElementById('populationTable').innerHTML = populationTable

    const renderRegionTable = regionTable => document.getElementById('regionTable').innerHTML = regionTable

    const renderLanguageTable = languageTable => document.getElementById('languageTable').innerHTML = languageTable

    const handleCountryData = async (url) => {
        try {
            // get data
            const countries = await getData(url)

            // generate html
            const basicStatsHTML = generateBasicStatsPerCountryTable(countries)
            const populationTable = generatePopulationTable(countries)
            const regionTable = generateRegionTable(countries)
            const languageTable = generateLanguageTable(countries)

            // render html
            renderBasicStatsPerCountryTable(basicStatsHTML)
            renderPopulationTable(populationTable)
            renderRegionTable(regionTable)
            renderLanguageTable(languageTable)
        } catch (e) {
            console.warn(e)
        }
    }

    // Event listeners
    document.getElementById('myForm').addEventListener('submit', async (event) => {
        event.preventDefault()
        const search = document.getElementById('searchCountry').value
        await handleCountryData(`https://restcountries.com/v3.1/name/${search}`)
    })

    document.getElementById('all').addEventListener('click', async (event) => {
        event.preventDefault()
        await handleCountryData('https://restcountries.com/v3.1/all')
    })
})()
