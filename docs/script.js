let myChart




async function setUP() {
    const response = await fetch('./data/data.json');
    const data = await response.json();
     
    // Get years for lables
    years = new Set(data.map(record => record.year))
    years = [...years]

    // Make an empty chart
    const canvas = document.getElementById('chart')
    myChart = new Chart(
        canvas,
        {
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
                                size: 20
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
    );

        


    function updateChart(countries, graph_by, years, zoom, factors,){
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
        }
        if (!zoom){
            if (graph_by == 'rank'){
                myChart.options.scales.y.min = 0
                myChart.options.scales.y.max = 180
            }else{
                myChart.options.scales.y.min = 0
                myChart.options.scales.y.max = 100
            }
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

    updateChart(['Ukraine', 'Russia', 'Average'], 'score', ['2002', '2025'], true)
}

setUP()

// Now it's UI part, I need to connect my panel controls to the graph

el_nav = document.getElementById('controls-panel')
el_zoom = document.getElementById('zoom-button')

el_country_input = document.getElementById('country-search')
el_countries_selector = document.getElementById('country-results')
el_countries_container = document.getElementById('selected-countries-container')

el_graphby = document.getElementById('metric-selector')
el_year_start = document.getElementById('year-start')
el_year_end = document.getElementById('year-end')
el_factors_container = document.getElementById('factors-container')


updateChart(['Ukraine', 'Israel', 'Average'], 'score', ['2002', '2025'], true)















