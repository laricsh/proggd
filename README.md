# ProGGD - Profiling Knowledge Graphs with Graph Generating Dependencies 

ProGGD is a system that uses Graph Generating Dependencies to represent information about the graph data. Graph Generating Dependencies can express topological constraints based on two (possibly different) graph patterns and the similarity of property values of nodes and edges within those defined graph patterns[^1]. 
Given a graph and its schema information, ProGGD discovers GGDs from the graph data and display to the user not only the GGD in itself but also data-examples of validated/non-validated of each one of the GGDs. 

[^1] Shimomura, L.C., Yakovets, N. and Fletcher, G., 2022. Reasoning on Property Graphs with Graph Generating Dependencies. arXiv preprint arXiv:2211.00387.

## Building ProGGD

ProGGD has three main components:

- The interface available in this repository
- GGDMiner (https://github.com/laricsh/ggdminer)  
- sHINER (https://github.com/smartdatalake/gcore-spark-ggd)

To build and run proGGD: 

1. Build and run sHINER's REST API mode from proggd branch. 
2. Clone this repository and run the following command:

```
python3 backend/mainapp.py 
```

mainapp.py uses Python FAST API - you might need Uvicorn (https://www.uvicorn.org/) to run it. 

3. Next, run the web interface by using the following command:

```
cd interface
npm run build
```

or 

```
cd interface
npm start
```

### Input file format

The input file format for both dataset and schema are available in the sHINER Manual.

> [!WARNING]
> This project components sHINER and GGDMiner are in constant changes and we will be updating these instruction periodically. We will soon provide a docker for an easier installation.