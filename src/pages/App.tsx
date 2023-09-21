import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { Scatterplot } from "../components/Scatterplot";
import { LoadFile } from '../components/loadfile';
import testGenes from '../data/moregenes.json'
import { Boxplot } from '../components/Boxplot';
import { BoxAndScatter } from '../components/BoxAndScatter';
import Alert from 'react-bootstrap/Alert';
import { GeneTable } from '../components/GeneTable';

type PlotMode = 'lines' | 'markers' | 'text' | 'lines+markers' | 'text+markers' | 'text+lines' | 'text+lines+markers' | 'none' | 'gauge' | 'number' | 'delta' | 'number+delta' | 'gauge+number' | 'gauge+number+delta' | 'gauge+delta';

const data = [
  {
    x:[0,0,0,0,0,0,0,0],
    y: [0, 1, 1, 2, 3, 5, 8, 13, 21],
    jitter: 0.3,
    pointpos: -1.8,
    type: 'box'
  }
]as Plotly.PlotData[];
const newGenes = JSON.parse(JSON.stringify(testGenes)).map((x: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.entries(x));
const GENENAMES = newGenes.map((x: string[][]) => x[0][1].toString().toLowerCase());

function Graph() {
  /*The long list of variables here are what this component needs to function. They represent the various 
  parts of the gene information. It's stored in the stat above so other components like the boxplot can also
  use them. It's of the format {list of variable names}: {Varname: type}.*/
  const [content, setContent] = useState<[...string[]][]>(newGenes);
  const [names, setNames] = useState<string[]>(GENENAMES)
  const [gene, setGene] = useState<[...string[]]>(newGenes[0]);
  const [geneName, setGeneName] = useState<string>(GENENAMES[0]);
  const [geneDescription, setGeneDescription] = useState<string>("Sample Description");
  const [plot, setPlot] = useState<string>("Box and Scatter");
  const [tempGene, setTempGene] = useState<string>("");
  const [plotType, setPlotType] = useState<Plotly.PlotType>("box");
  const [mode, setMode] = useState<PlotMode>("none");
  const [dataMap, setDataMap] = useState<Plotly.PlotData[]>([]);
  const [dataMaps, setDataMaps] = useState<Plotly.PlotData[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [x, setX] = useState<Number[]>([]);

  const groupIdenticalElements = useCallback((xpoints: number[], ypoints: number[]) => {
    const xgroups: {[key: number]: number[]} = {};
    const ygroups: {[key: number]: number[]} = {};
    xpoints.forEach((element, index) => {
      if (xgroups[element]) {
        xgroups[element].push(element);
        ygroups[element].push(ypoints[index]);
      } else {
        xgroups[element] = [element];
        ygroups[element] = [ypoints[index]]
      }
    });
  
    const xresult = Object.values(xgroups);
    const yresult = Object.values(ygroups);
    return [xresult, yresult];
  }, []);
  
  /*This is the function that controls the entire page whenever a gene is changed*/
  const updateGene = useCallback((geneID: string) => {
    /*These next two lines ensure that whenever you input a gene name 
    regardless of being uppercase or lower case it makes it consistent for the program*/
    geneID = geneID.toLowerCase()
    //Checks to make sure the gene name you entered actually exists and changes it accordingly
    if(GENENAMES.includes(geneID)){
      setGeneName(geneID);
      setShowAlert(false);
    }
    else{
      //alert("Gene not found! Check Spelling.");
      setShowAlert(true);
      setGeneName(geneName);
    }
    /*Searches the Json file for the name of the gene entered and updates the gene object
    This is different from just updating the geneName, they are used for different things*/
    const tempGene = gene;
    const changeData = newGenes.find((name: [...string[]]): boolean => name[0][1].toLowerCase() === geneID) as string[];
    if(changeData === undefined){
      setGene(tempGene);
      setGeneDescription("");
      setGeneName("dummy data");
      setDataMap(data);
      setDataMaps(data);
    }
    else{
      setGene(changeData);
      setGeneDescription(changeData[1][1]);
      const xpoints = changeData.slice(2).map(x => parseFloat(x[0].split("_")[0]));
      setX(Array.from(new Set(xpoints)));
      const ypoints = changeData.slice(2).map(x => parseFloat(x[1]));
      const groupedByHours = groupIdenticalElements(xpoints, ypoints);
      const numXpoints = groupedByHours[0];
      const numYpoints = groupedByHours[1];

      const data: Partial<Plotly.PlotData>[] = numXpoints.flatMap((xArr, index) => {
        const yArr = numYpoints[index];
        return {
          x: xArr,
          y: yArr,
          type: plotType,
          name: xArr[0].toString() + " Hour",
          mode: mode
        };
      });
      //This is the data used by the Scatterplot and Boxplot
      const mappedData: Plotly.PlotData[] = data.map((item: Partial<Plotly.PlotData>) => {
        return {
          x: item.x || [], // use an empty array if x is undefined
          y: item.y || [], // use an empty array if y is undefined
          type: item.type || 'box', // set default type to 'box'
          name: item.name,
          mode: item.mode
        };
      })as Plotly.PlotData[];
      setDataMap(mappedData);
            //This is the data used by only the Box and Scatter
      var mappedDatas: Plotly.PlotData[] = data.map((item: Partial<Plotly.PlotData>) => {
        return {
          x: item.x || [], // use an empty array if x is undefined
          y: item.y || [], // use an empty array if y is undefined
          type: "scatter",
          name: item.name,
          mode: "markers",
          marker : {color: '#606060'}
        };
      })as Plotly.PlotData[];
      mappedDatas = mappedData.concat(mappedDatas);
      setDataMaps(mappedDatas);
    }
  }, [setDataMaps, setDataMap, groupIdenticalElements, plotType, mode, gene, geneName]);
  

  const updateGeneAndPlot = useCallback((plot: string, geneID: string, plotType: Plotly.PlotType , mode: PlotMode) => {
    setPlot(plot);
    updateGene(geneID);
    setPlotType(plotType);
    setMode(mode);
  }, [updateGene, setPlotType, setMode]);
  useEffect(() => {
    // This function will be called whenever `geneName`, `plotType` change
    updateGeneAndPlot(plot,geneName, plotType,mode);
  }, [plot, geneName, plotType, mode, updateGeneAndPlot]);

  /*Below the first Form.Label is a searchbox to change the gene, it uses the gene for the program.
  The form.select is a dropdown menu to change the plot type
  */
  return (
    <><div className="App">
        <header className="App-header">
          <LoadFile
          {...plot === "dont show" &&
            {names}
          }
          content={content} setContent={setContent} setNames={setNames}></LoadFile>
        </header>
      </div>
      <div>
      <div className = "geneNotFoundAlert">
        {showAlert === true &&
          <Alert variant="danger">
          <Alert.Heading>Gene not found</Alert.Heading>
          <p>
          Cannot find the gene you are looking for? Please visit
          <Alert.Link href="https://www.genecards.org/"> https://www.genecards.org/ </Alert.Link>
          and find the gene symbol
          </p>
        </Alert>}
      </div>
      <div className="container">
        <div className="searchbox-plotDropDown">
          <div className="searchbox">
            <div className="input-group">
             <input type="text" className="form-control" placeholder="Search Gene" onChange={(event) => setTempGene(event.target.value)} />
              <li className="listButtons" onClick={() => { updateGene(tempGene); }}>Change Gene</li>
            </div>
          </div>
          <div className="plotDropDown">
            <select id="plotSelect" onChange={(e) => updateGeneAndPlot(
              e.target.value === "Box and Scatter" ? "Box and Scatter" : "Scatterplot",
              geneName,
              e.target.value !== "Scatterplot" ? "box" : "scatter",
              e.target.value === "Scatterplot" ? "markers" : "none")}>
              <option value="Box and Scatter">Box and Scatter</option>
              <option value="Scatterplot">Scatterplot</option>
              <option value="Boxplot">Boxplot</option>
            </select>
          </div>
        </div>
      </div>

      <div className="graph-container">
        {plot === "Box and Scatter" &&
        <BoxAndScatter
        dataMap={dataMaps}
        geneName={geneName}
        geneDescription={geneDescription}
        xPoints={x}
        ></BoxAndScatter>
        }
        {plot === "Scatterplot" &&
        <Scatterplot
        dataMap={dataMap}
        geneName={geneName}
        geneDescription={geneDescription}
        xPoints={x}
        ></Scatterplot>
        }
        {plot !== "Box and Scatter" && plot !== "Scatterplot" &&
        <Boxplot
        dataMap={dataMap}
        geneName={geneName}
        geneDescription={geneDescription}
        xPoints={x}
        ></Boxplot>
        }
      </div>
      <div className='tablescroll'><GeneTable gene={gene}></GeneTable></div>
    </div></>
  );
}

export default Graph;
