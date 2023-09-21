import Plot from "react-plotly.js";
import '../styles/Graphs.css'
/*The long list of variables here are what this component needs to function. They represent the various 
parts of the gene information. It's stored in the stat above so other components like the BoxPlot can also
use them. It's of the format {list of variable names}: {Varname: type}.
These variables are passed in as arguments when this is called in app.tsx*/
export function BoxAndScatter({dataMap, geneName, geneDescription, xPoints}:
  {dataMap: Plotly.PlotData[];
  geneName: string;
  geneDescription: string;
  xPoints: Number[]
  }): JSX.Element {
    return (
      <div className="graph-container">
        <Plot
          data= {dataMap}
          layout={ {
            width: 1000,
            height: 600,
            title: geneName,
            margin: { t: 90, b: 120},
            xaxis: {
              title: {
                text: "Hour",
                font: {
                  size: 18,
                  color: 'black'
                }
              },
              tickvals: xPoints, // Assumes all traces have the same x values
              tickmode: 'array',
              tickangle: 0,
              automargin: true
            }, 
            yaxis: {
              title: {
                text: "FPKM",
                font: {
                  size: 18,
                  color: 'black'
                }
              },
              rangemode: 'tozero'
            },
            annotations: [
              {
                text: geneDescription,
                showarrow: false,
                xref: "paper",
                yref: "paper",
                x: 0.5,
                y: -0.3,
                font: {
                  size: 14,
                  color: "#262927"
                },
                xanchor: "center"
              }            
            ],
          }}
          config = {{
            toImageButtonOptions: {
              format: 'svg', // one of png, svg, jpeg, webp
              filename: 'boxplotscatterplot_image',
              height: 500,
              width: 700,
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }}
          }
        />
      </div>
    );
}
