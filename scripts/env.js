
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

var filtersArray = [
    {"filter": "role", "value": []},
    {"filter": "company_size", "value": []},
    {"filter": "education", "value": []}
    // {"filter": "company_size", "value": ["0-49"]}
    // {"filter": "company_size", "value": ["0-49", "50-249"]}
    // {"filter": "company_size", "value": ["0-49", "50-249", "250-999"]}
];

const education_levels = ["High school", "Some college study with no degree", "Professional degree", "Bachelor's degree", "Master's degree", "Doctoral degree"];
const education_levels_map = {"No formal education past high school": "High school", "Some college/university study without earning a bachelor’s degree": "Some college study with no degree", "Professional Degree": "Professional Degree", "Bachelor's degree": "Bachelor's degree", "Master's degree": "Master's degree", "Doctoral degree": "Doctoral degree"};
const education_levels_undefined = {17: "Bachelor's degree", 15: "Master's degree", 19: "Professional degree"};

const incomes = ["0-9,999", "10,000-49,999", "50,000-99,999", "100,000-199,999", "200,000-500,000", "> 500,000"];

var map_filters_attributes = {"role": "q5", "company_size": "q20", "education": "q4"};

// var count_roles = {"Business Analyst": 0, "Data Analyst": 0, "Data Engineer": 0, "Data Scientist": 0, "DBA/Database Engineer": 0, "Machine Learning Engineer": 0, "Product/Project Manager": 0, "Research Scientist": 0, "Software Engineer": 0, "Statistician": 0};

var count_roles = {"Data Engineer": 0, "Software Engineer": 0, "Data Scientist": 0, "Research Scientist": 0, "Statistician": 0, "Product/Project Manager": 0, "Data Analyst": 0, "Machine Learning Engineer": 0, "Business Analyst": 0, "DBA/Database Engineer": 0, "total": 0};
var percentage_roles = {"Data Engineer": 0, "Software Engineer": 0, "Data Scientist": 0, "Research Scientist": 0, "Statistician": 0, "Product/Project Manager": 0, "Data Analyst": 0, "Machine Learning Engineer": 0, "Business Analyst": 0, "DBA/Database Engineer": 0, "total": 0};

const map_roles_acronimous = {"Business Analyst": "BA", "Data Analyst": "DA", "Data Engineer": "DE", "Data Scientist": "DS", "DBA/Database Engineer": "DBA", "Machine Learning Engineer": "MLE", "Product/Project Manager": "PM", "Research Scientist": "RS", "Software Engineer": "SW", "Statistician": "S"}

var original_data_size = 0;

var original_data = [];

var role_filter_updated = false;