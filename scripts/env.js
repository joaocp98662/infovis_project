
// const roles_colors = [{"Business Analyst": "#744700", "Data Analyst": "#744700", "Data Engineer": "#744700", "Data Scientist": "#16537e", "DBA/Database Engineer": "#cc0000", "Machine Learning Engineer": "#6a329f", "Product/Project Manager": "#f1c232", "Research Scientist": "#ce7e00", "Software Engineer": "#000000", "Statistician": "#274e13"}];

const roles_colors = {"Default": "#5b5b5b", "Business Analyst": "#744700", "Data Analyst": "#8fce00", "Data Engineer": "#c90076", "Data Scientist": "#16537e", "DBA/Database Engineer": "#cc0000", "Machine Learning Engineer": "#6a329f", "Product/Project Manager": "#f1c232", "Research Scientist": "#ce7e00", "Software Engineer": "#000000", "Statistician": "#274e13"};
const roles = ["Default", "Business Analyst", "Data Analyst", "Data Engineer", "Data Scientist", "DBA/Database Engineer", "Machine Learning Engineer", "Product/Project Manager", "Research Scientist", "Software Engineer", "Statistician"]
// const colors_roles = ["#5b5b5b", "#744700", "#8fce00", "#c90076", "#16537e", "#cc0000", "#6a329f", "#f1c232", "#ce7e00", "#000000", "#274e13"];

//const activities_columns = [{"q23_1": "Analyze and understand data to influence product or business decisions"}, {"q23_2": "Build and/or run the data infrastructure that my business uses for storing, analyzing, and operationalizing data"}, {"q23_3": "Build prototypes to explore applying machine learning to new areas"}, {"q23_4": "Build and/or run a machine learning service that operationally improves my product or workflows"}, {"q23_5": "Experimentation and iteration to improve existing ML models"}, {"q23_6": "Do research that advances the state of the art of machine learning"}, {"q23_7": "None of these activities are an important part of my role at work"}, {"q23_8": "Other"}];

const activities_columns = [
    {column: "q23_1", label: "Analyze and understand data to influence product or business decisions"}, 
    {column: "q23_2", label:"Build and/or run the data infrastructure that my business uses for storing, analyzing, and operationalizing data"}, 
    {column: "q23_3", label:"Build prototypes to explore applying machine learning to new areas"}, 
    {column: "q23_4", label: "Build and/or run a machine learning service that operationally improves my product or workflows"}, 
    {column: "q23_5", label: "Experimentation and iteration to improve existing ML models"}, 
    {column: "q23_6", label:"Do research that advances the state of the art of machine learning"}, 
    {column: "q23_7", label:"None of these activities are an important part of my role at work"}, 
    {column: "q23_8", label: "Other"}
];

const roles_count = [
    { label: 'Business Analyst', count: 1 },
    { label: 'Data Analyst', count: 1 },
    { label: 'Data Engineer', count: 1 },
    { label: 'Data Scientist', count: 1 },
    { label: 'DBA/Database Engineer', count: 1 },
    { label: 'Machine Learning Engineer', count: 1 },
    { label: 'Product/Project Manager', count: 1 },
    { label: 'Research Scientist', count: 1 },
    { label: 'Software Engineer', count: 1 },
    { label: 'Statistician', count: 1 },
];

// const roles_indexes = [
//     { role: 'Business Analyst', index: 1 },
//     { role: 'Data Analyst', index: 2 },
//     { role: 'Data Engineer', index: 3 },
//     { role: 'Data Scientist', index: 4 },
//     { role: 'DBA/Database Engineer', index: 5 },
//     { role: 'Machine Learning Engineer', index: 6 },
//     { role: 'Product/Project Manager', index: 7 },
//     { role: 'Research Scientist', index: 8 },
//     { role: 'Software Engineer', index: 9 },
//     { role: 'Statistician', index: 10 },
// ]