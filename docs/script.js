let myChart
let data = {}
let chartState = [['Ukraine', 'Russia', 'Average'], 'score', ['2002', '2025'], false]


// Make an empty chart
const canvas = document.getElementById('chart')
basicChartOptions =  {
        type:'line',
        data: {},
        options: {
            scales:{
                x: {
                    grid: {
                        color: '#757575'
                    },
                    ticks: {
                        color: '#d1d1d1'
                    },
                },
                y: {
                    ticks: {
                        color: '#d1d1d1'
                    },
                    grid: {
                        color: '#757575'
                    },
                    title: {
                        display: true, 
                        color: '#d1d1d1',
                        font: {
                            size: 30
                        }
                    },
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#d1d1d1'
                    }
                }
            }
        }
}
myChart = new Chart(canvas, basicChartOptions)

function updateChart(countries, graph_by, years, zoom, factors,){
    // Terminate and alert if data from async is not ready yet
    if (!Object.keys(data).length){
        alert('woh-woh, fasty. Give me a sec');
        return
    }

    years = years.map(year => parseInt(year))
    let yearsUpd = [] // Get a complete list of selected years
    for (let i = years[0]; i <= years[1]; i++){
        if (i == 2011){ // Again, there is no data for 2011
            continue
        }
        yearsUpd.push(i)
    }

    // Down I set up the labels of the graph, depending on years, metric and zooming
    myChart.data.labels = yearsUpd
    myChart.options.scales.y.title.text = String(graph_by).charAt(0).toUpperCase() + String(graph_by).slice(1)
    if (graph_by == 'rank'){
        myChart.options.scales.y.reverse = true
    }else{
        myChart.options.scales.y.reverse = false
    }
    if (!zoom){
        if (graph_by == 'rank'){
            myChart.options.scales.y.min = 0
            myChart.options.scales.y.max = 180
        }else{
            myChart.options.scales.y.min = 0
            myChart.options.scales.y.max = 100
        }
    }else{
        myChart.options.scales.y.min = null
        myChart.options.scales.y.max = null
    }

    data_main = {} // Get main Rank/Score data for each country
    countries.forEach((country) => {
        data_main[country] = data.filter(row => {
            return (row.country == country) && (yearsUpd.includes(row.year))
        }).map(row => row[graph_by])
    });
    
    data_factors = {} 
    if (factors){ // Get factors data. Optionally
        countries.map((selected_country) => {
            data_factors[selected_country] = {} 
            factors.forEach((factor) => {
                data_factors[selected_country][factor] = (data.filter(row => {
                    return (row.country == selected_country) && (yearsUpd.includes(row.year))
                }).map(row => row[factor]))
            });
        });
    }

        
    myChart.data.datasets = []
    Object.keys(data_main).forEach((key) => { // Plotting main indicator for countries
        myChart.data.datasets.push({
            label: key,
            data: data_main[key]
        })
    })

    if ((yearsUpd[yearsUpd.length - 1] > 2021) 
        && (data_factors != {})){ // Plotting factors if defined and years in scope
        for (let country of Object.keys(data_factors)){
            for (let factor of Object.keys(data_factors[country])){
                myChart.data.datasets.push({
                    borderDash: [10, 5],
                    borderWidth: 2,
                    label: `${country}_${factor}`,
                    data: data_factors[country][factor]
                })
            }
        }
    }

    myChart.update()
}

async function setUP() { // Gets the data and populates the chart
    const response = await fetch('./data/data.json');
    data = await response.json();

    updateChart(...chartState)

    populateCountries()
}
setUP()



// Now it's UI part, I need to connect my panel controls to the graph

el_nav = document.getElementById('controls-panel')
el_zoom = document.getElementById('zoom-button')
el_download = document.getElementById('download-button')

el_country_input = document.getElementById('country-search')
el_countries_selector = document.getElementById('country-results')
el_countries_container = document.getElementById('selected-countries-container')

el_graphby_rank = document.getElementById('metric-rank')
el_graphby_score = document.getElementById('metric-score')
el_year_start = document.getElementById('year-start')
el_year_end = document.getElementById('year-end')
el_factors_container = document.getElementById('factors-container')

// Connect Zoom and Download
el_zoom.addEventListener('click', () => {
    if (el_zoom.classList.contains('active_zoom')){
        chartState[3] = false
        updateChart(...chartState)
    }else{
        chartState[3] = true
        updateChart(...chartState)
    }
    el_zoom.classList.toggle('active_zoom')
})
el_download.addEventListener('click', () => {
            const imageURI = myChart.toBase64Image();

            const a = document.createElement('a');
            a.href = imageURI; 
            a.download = 'my-chart.png'; 

            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a); 
})

// Connect Rank/Score toggle
el_graphby_rank.addEventListener('click', () => {
    if (!el_graphby_rank.classList.contains('active')){
        el_graphby_rank.classList.toggle('active')
        el_graphby_score.classList.toggle('active')
        chartState[1] = 'rank'
        updateChart(...chartState)
        
    }
})
el_graphby_score.addEventListener('click', () => {
    if (!el_graphby_score.classList.contains('active')){
        el_graphby_rank.classList.toggle('active')
        el_graphby_score.classList.toggle('active')
        chartState[1] = 'score'
        updateChart(...chartState)
    }
})


// At this moment i've notice that i was using the wrong naming convention for el links
// I'll leave it as it is for now, but it's something to keep in mind, as people in webdev are accustomed to use camelCase

// Used Gemini to create a flag mapper
const countryFlagsMapper = {
  "Afghanistan": "🇦🇫",
  "Albania": "🇦🇱",
  "Algeria": "🇩🇿",
  "Andorra": "🇦🇩",
  "Angola": "🇦🇴",
  "Argentina": "🇦🇷",
  "Armenia": "🇦🇲",
  "Australia": "🇦🇺",
  "Austria": "🇦🇹",
  "Average": "📊", // Special case: a chart emoji for the average
  "Azerbaijan": "🇦🇿",
  "Bahrain": "🇧🇭",
  "Bangladesh": "🇧🇩",
  "Belarus": "🇧🇾",
  "Belgium": "🇧🇪",
  "Belize": "🇧🇿",
  "Benin": "🇧🇯",
  "Bhutan": "🇧🇹",
  "Bolivia": "🇧🇴",
  "Bosnia and Herzegovina": "🇧🇦",
  "Botswana": "🇧🇼",
  "Brazil": "🇧🇷",
  "Brunei": "🇧🇳",
  "Bulgaria": "🇧🇬",
  "Burkina Faso": "🇧🇫",
  "Burundi": "🇧🇮",
  "Cambodia": "🇰🇭",
  "Cameroon": "🇨🇲",
  "Canada": "🇨🇦",
  "Cape Verde": "🇨🇻",
  "Caribbean States": "🏴‍☠️", // Special case: a fun flag for a region
  "Central African Republic": "🇨🇫",
  "Chad": "🇹🇩",
  "Chile": "🇨🇱",
  "China": "🇨🇳",
  "Colombia": "🇨🇴",
  "Comoros": "🇰🇲",
  "Congo": "🇨🇩", // Assumed to be DR Congo
  "Congo-Brazzaville": "🇨🇬",
  "Costa Rica": "🇨🇷",
  "Croatia": "🇭🇷",
  "Cuba": "🇨🇺",
  "Cyprus": "🇨🇾",
  "Czechia": "🇨🇿",
  "Czechoslovakia (Former)": "🏳️", // Special case: white flag for former country
  "Denmark": "🇩🇰",
  "Djibouti": "🇩🇯",
  "Dominican Republic": "🇩🇴",
  "Ecuador": "🇪🇨",
  "Egypt": "🇪🇬",
  "El Salvador": "🇸🇻",
  "Equatorial Guinea": "🇬🇶",
  "Eritrea": "🇪🇷",
  "Estonia": "🇪🇪",
  "Eswatini": "🇸🇿",
  "Ethiopia": "🇪🇹",
  "Fiji": "🇫🇯",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "Gabon": "🇬🇦",
  "Gambia": "🇬🇲",
  "Georgia": "🇬🇪",
  "Germany": "🇩🇪",
  "Ghana": "🇬🇭",
  "Greece": "🇬🇷",
  "Grenada": "🇬🇩",
  "Guatemala": "🇬🇹",
  "Guinea": "🇬🇳",
  "Guinea-Bissau": "🇬🇼",
  "Guyana": "🇬🇾",
  "Haiti": "🇭🇹",
  "Honduras": "🇭🇳",
  "Hong Kong": "🇭🇰",
  "Hungary": "🇭🇺",
  "Iceland": "🇮🇸",
  "India": "🇮🇳",
  "Indonesia": "🇮🇩",
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Ireland": "🇮🇪",
  "Israel": "🇮🇱",
  "Israel (occupied territories)": "🇵🇸", // Using Palestine flag for this context
  "Israel (outside Israeli territory)": "🇮🇱",
  "Italy": "🇮🇹",
  "Ivory Coast": "🇨🇮",
  "Jamaica": "🇯🇲",
  "Japan": "🇯🇵",
  "Jordan": "🇯🇴",
  "Kazakhstan": "🇰🇿",
  "Kenya": "🇰🇪",
  "Kosovo": "🇽🇰",
  "Kuwait": "🇰🇼",
  "Kyrgyzstan": "🇰🇬",
  "Laos": "🇱🇦",
  "Latvia": "🇱🇻",
  "Lebanon": "🇱🇧",
  "Lesotho": "🇱🇸",
  "Liberia": "🇱🇷",
  "Libya": "🇱🇾",
  "Liechtenstein": "🇱🇮",
  "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺",
  "Madagascar": "🇲🇬",
  "Malawi": "🇲🇼",
  "Malaysia": "🇲🇾",
  "Maldives": "🇲🇻",
  "Mali": "🇲🇱",
  "Malta": "🇲🇹",
  "Mauritania": "🇲🇷",
  "Mauritius": "🇲🇺",
  "Mexico": "🇲🇽",
  "Moldova": "🇲🇩",
  "Mongolia": "🇲🇳",
  "Montenegro": "🇲🇪",
  "Morocco": "🇲🇦",
  "Mozambique": "🇲🇿",
  "Myanmar": "🇲🇲",
  "Namibia": "🇳🇦",
  "Nepal": "🇳🇵",
  "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿",
  "Nicaragua": "🇳🇮",
  "Niger": "🇳🇪",
  "Nigeria": "🇳🇬",
  "North Korea": "🇰🇵",
  "North Macedonia": "🇲🇰",
  "Northern Cyprus": "🏳️", // No official emoji, using white flag
  "Norway": "🇳🇴",
  "Oman": "🇴🇲",
  "Pakistan": "🇵🇰",
  "Palestine": "🇵🇸",
  "Panama": "🇵🇦",
  "Papua New Guinea": "🇵🇬",
  "Paraguay": "🇵🇾",
  "Peru": "🇵🇪",
  "Philippines": "🇵🇭",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Qatar": "🇶🇦",
  "Romania": "🇷🇴",
  "Russia": "🇷🇺",
  "Rwanda": "🇷🇼",
  "Samoa": "🇼🇸",
  "Saudi Arabia": "🇸🇦",
  "Senegal": "🇸🇳",
  "Serbia": "🇷🇸",
  "Serbia and Montenegro (Former)": "🏳️", // Special case
  "Seychelles": "🇸🇨",
  "Sierra Leone": "🇸🇱",
  "Singapore": "🇸🇬",
  "Slovakia": "🇸🇰",
  "Slovenia": "🇸🇮",
  "Somalia": "🇸🇴",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  "South Sudan": "🇸🇸",
  "Spain": "🇪🇸",
  "Sri Lanka": "🇱🇰",
  "Sudan": "🇸🇩",
  "Suriname": "🇸🇷",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Syria": "🇸🇾",
  "Taiwan": "🇹🇼",
  "Tajikistan": "🇹🇯",
  "Tanzania": "🇹🇿",
  "Thailand": "🇹🇭",
  "Timor-Leste": "🇹🇱",
  "Togo": "🇹🇬",
  "Tonga": "🇹🇴",
  "Trinidad and Tobago": "🇹🇹",
  "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷",
  "Turkmenistan": "🇹🇲",
  "Uganda": "🇺🇬",
  "Ukraine": "🇺🇦",
  "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "United States (Foreign Impact)": "🇺🇸",
  "United States (in Iraq)": "🇺🇸",
  "Uruguay": "🇺🇾",
  "Uzbekistan": "🇺🇿",
  "Venezuela": "🇻🇪",
  "Vietnam": "🇻🇳",
  "Yemen": "🇾🇪",
  "Yugoslavia (Former)": "🏳️", // Special case
  "Zambia": "🇿🇲",
  "Zimbabwe": "🇿🇼"
};

// Funcs to Populate & Connect Country Selector (activated in async, as dependent on data)

let allCountries = []
function populateCountries(){
    allCountries = Array.from(new Set(data.map((record) => record.country))).sort()
    allCountries = allCountries.map((country) => country + ' ' + countryFlagsMapper[country])
}
function updateCountries(newList){
    el_countries_selector.innerHTML = ''
    newList.forEach((country) => {
        const el_country = document.createElement('div')
        el_country.textContent = country
        el_country.classList.add('country_in_selector')
        el_countries_selector.appendChild(el_country)

        

        el_country.addEventListener('click', () => {
            // Cleans the search
            el_country_input.value = ''
            el_countries_selector.classList.add('hidden')

            // Prepare text and remove_btn for appending
            el_country_selected = document.createElement('div')
            el_country_selected_text = document.createElement('p')
            el_country_remove_btn = document.getElementById('remove_country_btn').cloneNode(true)
            el_country_selected_text.textContent = el_country.textContent
            // Append and declare remove_btn eventListener
            el_country_selected.appendChild(el_country_selected_text)
            el_country_selected.appendChild(el_country_remove_btn)
            el_country_remove_btn.addEventListener('click', (e) => {
                let el_to_remove = e.target.closest('.country_in_container')
                el_to_remove.remove()
                // Here an update to the chart
            }, )
            el_country_selected.classList.add('country_in_container')
            el_countries_container.appendChild(el_country_selected)
            el_country_remove_btn.classList.remove('hidden')

            // Update the chart
            chartState[0].push(el_country.textContent.split(' ').slice(0, -1).join(' '))
            updateChart(...chartState)

        })
    })
    el_countries_selector.classList.remove('hidden')
}

el_country_input.addEventListener('input', (e) => {
    if (e.target.value.trim() === ''){
        el_countries_selector.classList.add('hidden')
        return
    }
     const priorityPattern = new RegExp('^' + e.target.value.toLowerCase())
     const usualPattern = new RegExp(e.target.value.toLowerCase())

     priorityList = allCountries.filter((country) => priorityPattern.test(country.toLowerCase()))
     usualList = allCountries.filter((country) => usualPattern.test(country.toLowerCase()))

     newList = Array.from(new Set(priorityList.concat(usualList)))
     updateCountries(newList)
})










