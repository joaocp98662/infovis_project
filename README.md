# Data Professionals: What are they made of?

The goal of this project was to put in practice all the theoretical and pratical knowledge gained in the Data Visualisation Course of my Data Science and Engineering master.

This visualisation gives important insights to the user about Data Professionals and their background, activities they perform, education level, income, programming languages they use. It is composed by 4 idioms: parallel set, radio chart, individual plot with counts and finally a heatmap. 

This visualisation gives answers to a variaty of questions about data professionals and what they are made of. An user can ask a simple question such as "Which are the education levels that guarantee the highest incomes", and for answering this question the user only need to visualise one idiom, the individual plot with counts, and take their conclusions. More complex questions can be asked and answered by analizing different idioms for the same question. This is possible through interaction between idioms.

The visualisation was developed using D3.js, a powerfull tool for developing customize visualisations using javascript. For the styling was used Bootstrap, a css framework.

The next figure shows the layout of the visualisation.


<img width="1792" alt="Captura de ecrã 2022-01-05, às 21 32 43" src="https://user-images.githubusercontent.com/81058181/148294244-6b833416-01fa-412a-9e44-713ec5de0557.png">

top row, left idiom - Parallel set that gives information about the different roles of the data professionals and the programming languages they use. By clicking at the elements (roles, programming languages and bars) it interacts with the other idioms and filters the data.

top row, right idiom - Radar chart that gives information about the activities perform by data professionals.

bottom row, left idiom - Individual plot with counts that gives information about the education level of these data professionals and the income they earn. Clicking in the education level filters the data in all the idioms showing data that corresponds to the selected education level

bottom row, right idiom - Heatmap that gives information about the data professional roles and how they are distributed in company sizes. Selecting a specific role will filter the data and change all the idioms.

The next figure shows the changes in the idioms after selecting a role in the last idioms (bottom, right)

<img width="1792" alt="Captura de ecrã 2022-01-05, às 21 58 44" src="https://user-images.githubusercontent.com/81058181/148295556-bb4af1f3-93bb-4c69-a24f-11855208c68b.png">

The dataset was obtained from a Kaggle Contest - "2020 Kaggle Machine Learning & Data Science Survey". Before start building the visualisation, first the data was cleaned and pre-processed to only use data that was relevant for the purpose of this visualisation. Irrelevant items were removed and irrelevant attributes were dropped.

