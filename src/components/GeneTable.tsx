import { Data } from "plotly.js";
import Plot from "react-plotly.js";
//https://plotly.com/javascript/table/
export function GeneTable({gene}:{gene: [...string[]];}): JSX.Element{
    const headers = gene.map(x => x[0]); 
    const cellvalues = gene.map(x => x[1]);
    headers.splice(1,1);
    cellvalues.splice(1,1);
    //the splice is removing the description, since it's already on the page
    const table = {
        type: 'table',
        header: {
            values: headers,
        },
        cells: {
            values: cellvalues,
        }
    }
    
    return(<Plot data={[table] as Data[]} layout={ {width: 6000, title: 'Gene Table'}} />)
}