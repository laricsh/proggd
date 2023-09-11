# Import flask and datetime module for showing date and time
import json
from typing import List

from fastapi import FastAPI
import uvicorn
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

import datetime
from shinerManager import ShinerManager
from typing import Any, Dict

GenericDict = Dict[str, Any]

# Initializing flask app
app = FastAPI()
GCORE_ENDPOINT = "http://0.0.0.0:8000/"
shinner_manager = ShinerManager(GCORE_ENDPOINT)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/gcore/configminer")
def set_configminer(args: GenericDict):
    graph = args["graph"]
    configminer=args["configminer"]
    return shinner_manager.set_configMiner(graph, json.dumps(configminer))

@app.get("/gcore/schema/{graph_name}")  # ok
def get_schema(graph_name: str):
    return shinner_manager.graph_schema(graph_name)

@app.get("/gcore/numberLabels/{graph_name}")  # ok
def get_numberLabels(graph_name: str):
    return shinner_manager.number_labels(graph_name)

@app.get("/gcore/availableGraphs")
async def get_graphdb():
    return shinner_manager.get_graphs()

@app.get("/ggdminer/frequentSubgraphs")
def get_frequentSubgraphs():
    return shinner_manager.get_frequentSubgraphs()

@app.get("/ggdminer/ggds")
def get_frequentSubgraphs():
    return shinner_manager.get_ggdsProfiling()

@app.get("/ggdminer/ggdstats")
def get_frequentSubgraphs():
    return shinner_manager.get_ggdsStats()

@app.post("/ggdminer/numericalComparison")
def get_comparisonData(args:List[GenericDict]):
    return shinner_manager.get_comparisonData(json.dumps(args))

@app.get("/ggdminer/attributePairs")
def get_attributePairs():
    return shinner_manager.get_attrpairs()

@app.post("/ggdminer/similarityIndex")
def get_SimIndex(args: GenericDict):
    print(args)
    return shinner_manager.get_simindex(json.dumps(args))

@app.post("/ggdminer/highlightMatches")
def get_matches(args: GenericDict):
    print(args)
    return shinner_manager.get_matches(json.dumps(args))

@app.post("/ggdminer/similarityJoin")
def get_SimJoin(args: GenericDict):
    print(args)
    return shinner_manager.get_simjoin(json.dumps(args))

@app.get("/ggdminer/attributeIndexes")
def get_attributePairs():
    return shinner_manager.get_attrindexes()

@app.get("/ggdminer/numericalValues")
def get_numValues():
    return shinner_manager.get_numvalues()

@app.post("/ggdminer/histogram")
def get_histogram(args: GenericDict):
    return shinner_manager.get_histogram(json.dumps(args))

@app.post("/ggdminer/getAnswerGraph")
def get_answergraph(args: GenericDict):
    return shinner_manager.get_answergraph(json.dumps(args))

@app.post("/ggdminer/getGGDAnswerGraph")
def get_ggdanswergraph(args: GenericDict):
    return shinner_manager.get_ggdanswergraph(json.dumps(args))

@app.post("/ggdminer/getNodeLinkProperties")
def get_properties(args: GenericDict):
    return shinner_manager.get_nodelinkproperties(json.dumps(args))

@app.post("/gcore/er/setggds")
def set_ggds(args: List[GenericDict]): #List[GGDsPayload]
    return shinner_manager.set_ggds(json.dumps(args))

@app.post("/gcore/uniquevalues")
def get_uniqueValues(args: GenericDict):
    print(args)
    return shinner_manager.get_unique(json.dumps(args))

@app.post("/gcore/minmaxvalues")
def get_uniqueValues(args: GenericDict):
    print(args)
    return shinner_manager.get_minmax(json.dumps(args))


@app.post("/gcore/histogram")
def get_histogramValues(args: GenericDict):
    graph = args["graph"]
    label = args["label"]
    property =args["property"]
    return shinner_manager.get_histogram(args)

@app.get("/gcore/er/getggds")
def get_ggds():
    return shinner_manager.get_ggds()

@app.get("/gcore/er/run")
def run_er():
    return shinner_manager.run_ER()


@app.post("/gcore/er/drop-tables")
def drop_ggds(args: List[GenericDict]):
    return shinner_manager.drop_ggds(args)

@app.post("/gcore/er/targetgraph")
def target_graph_create(args: GenericDict):
    return shinner_manager.target_graph_create(args)


@app.post("/gcore/query/select")
def select_query(args: GenericDict):
    query = args["query"]
    limit = args["limit"]
    print("here select panel" + query)
    return shinner_manager.selectQuery(query, limit)


@app.post("/gcore/set-source-constraints")
def set_constraints(args: GenericDict):
    constraints = args["constraints"]
    ggd = args["ggd"]
    return shinner_manager.set_source_constraints(constraints, ggd)


@app.post("/gcore/query/construct")
def construct_query(args: GenericDict):
    query = args["query"]
    limit = args["limit"]
    print("here construct panel" + query)
    return shinner_manager.constructQuery(query, limit)


# args for both select and graph neighbor
# json format for "passing node information"
# {
#        "nodeLabel": "ProductAmazon",
#        "id": "1",
#        "edgeLabel": "",
#        "graphName": "Amazon",
#        "limit": -1
#    }
@app.post("/gcore/query/select-neighbor")
def select_neighbor(args: GenericDict):
    return shinner_manager.getNeighbors(args)


@app.post("/gcore/query/graph-neighbor")
def graph_neighbor(args: GenericDict):
    return shinner_manager.getNeighborsGraph(args)


def main():
    portRun=5000
    print(f"Serving on port {portRun} in live mode.")
    uvicorn.run("mainapp:app", host="0.0.0.0", port=portRun, reload=False, access_log=False)


if __name__ == "__main__":
    main()
