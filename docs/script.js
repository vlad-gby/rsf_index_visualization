


let myChart

async function get_data() {
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

        


    function updateChart(countries, graph_by, years, zoom, factors){
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
                myChart.options.scales.y.min = -10
                myChart.options.scales.y.max = 142
            }
        }

        data_main = {} // Get main Rank/Score data for each country
        countries.forEach((country) => {
            data_main[country] = data.filter(row => {
                return (row.country == country) && (yearsUpd.includes(row.year))
            }).map(row => row[graph_by])
        });
        
        factorsData = {} 
        if (factors){ // Get factors data. Optionally
            countries.map((selected_country) => {
                factorsData[selected_country] = {} 
                factors.forEach((factor) => {
                    factorsData[selected_country][factor] = (data.filter(row => {
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
            && (factorsData != {})){ // Plotting factors if defined and years in scope
            for (let country of Object.keys(factorsData)){
                for (let factor of Object.keys(factorsData[country])){
                    myChart.data.datasets.push({
                        borderDash: [10, 5],
                        borderWidth: 2,
                        label: `${country}_${factor}`,
                        data: factorsData[country][factor]
                    })
                }
            }
        }

        myChart.update()
    }

    updateChart(['Ukraine', 'Russia'], 'rank', ['2002', '2025'], false)


}


get_data()
