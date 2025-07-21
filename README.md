# The Freedom's Trajectory: An Interactive Press Freedom Explorer

### **➡️ [Explore the live application here](https://vlad-gby.github.io/rsf_index_visualization/)**

<img width="1470" height="800" alt="The Freedom's Trajectory Screenshot" src="https://github.com/user-attachments/assets/a3ea8c2c-7686-4369-9c97-bcf04a6175dd" />

---

## About This Project

As a data science student from Sumy, Ukraine, I've always been fascinated by the Reporters Without Borders (RSF) Press Freedom Index. While the official site provides an excellent annual snapshot, I felt the data could be structured to tell a more dynamic story—like way of change and trajectory over time.

This project was born from a simple question: How has press freedom *really* evolved over the last two decades? What factors contributed to it in general and in countries in particular? How can we correlate these changes with the real-world actions and decisions in a way to plan our actions in order to maintain quality in journalism and responsible accounting?

I built this interactive tool not just as a technical exercise, but to create real value for anyone interested in journalism, politics, and data. It's designed to be a companion to the official RSF index, allowing researchers, journalists, and curious citizens to explore the nuances behind the numbers. This is a portfolio piece intended to showcase my skills in transforming complex, messy data into a clean, insightful, and user-friendly application.

## Key Features

* **Multi-Country Comparison:** Plot up to three countries (or the global average) on the same graph to compare their trajectories.
* **Dynamic Metrics:** Instantly switch between viewing a country's **Rank** and its normalized **Score**.
* **Factor Analysis:** Isolate the five key components of the index (**Political, Economic, Legal, Social, and Safety**) to understand the specific drivers of a country's performance.
* **Interactive Controls:** A fully responsive UI with a searchable country selector, a dynamic year range, and zoom/download functionality.
* **Data-Driven Insights:** The tool reveals key historical moments, such as the impact of the Orange Revolution on Ukraine's press freedom or the critical role of the "Safety" score in conflict zones.

## Tech Stack

* **Data Processing & Analysis:** Python, Pandas, NumPy
* **Frontend & Visualization:** Vanilla JavaScript, Chart.js, Tailwind CSS, HTML5

## The Data Science Journey

The core of this project was not the front-end, but the significant data wrangling required to make the visualization possible. The raw data from RSF was spread across more than 20 separate CSV files, each with its own inconsistencies.

My process involved:

1.  **Data Aggregation:** Programmatically fetching and merging over two decades of data into a single, unified DataFrame.
2.  **Intensive Cleaning & Standardization:** Systematically handling a wide range of data quality issues, including:
    * Inconsistent column names (`Year`, `Year (N)`, `ï»¿Year (N)`).
    * Varying country codes and names (`USA`, `USA1`, `USA_I`).
    * Mixed data types and formats (e.g., scores as strings with commas).
3.  **Score Normalization:** The most significant challenge was a complete change in RSF's scoring methodology in 2013. The scale inverted and shifted from `-10:142` to `0:100`. To ensure a continuous and truthful trendline, I developed and applied a linear normalization formula to all pre-2013 scores:
    ```python
    data.loc[data['year'] < 2013, 'score'] = 100 - ((data.loc[data['year'] < 2013, 'score'] + 10) / 152 * 100)
    ```
4.  **Feature Engineering:** I created the "Average" metric by grouping the entire dataset by year, calculating the mean for all relevant columns, and inserting it back into the main dataset. This provides a crucial baseline for comparison.

## A Note on Design

While my primary focus is data science, I believe a good user experience is essential for making data accessible. I sought to find a balance where the design is clean and intuitive for everyone, from researchers to casual observers. The initial HTML framework was scaffolded with the help of Gemini, which I then heavily modified to fit the project's specific UX needs, including full mobile responsiveness.

## License

This project is open-source and available under the [MIT License](LICENSE).

---
*Data is sourced from [Reporters Without Borders (RSF)](https://rsf.org). This project is not affiliated with RSF.*
