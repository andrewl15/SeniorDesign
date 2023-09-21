
import React from "react";
import Accordion from "../components/Accordion";

const About = () => {
  return (
    <div className = "about">
    <div className = "textblock">
      <br></br>
      <br></br>
      <br></br>
      <h1><strong>About</strong></h1>
      The identification of genes that function in the development of
      the eye and its associated defects presents a formidable challenge. In the recent
      past, however, high-throughput genome-level RNA profiling – termed
      transcriptomics – has become increasingly applicable on small developing
      tissues due to technologies such as microarrays and RNA sequencing. Their
      application to investigate specific eye tissues and cell types holds high promise
      to impact ocular gene discovery. However, high-throughput gene expression
      profiling has brought with it new challenges, mainly the effective analysis,
      compilation, access and visualization of these large amounts of data for
      prioritizing promising candidates for further analysis.
    </div>
    <div className = "instructions">
      <br></br>
      <h1><strong>Instructions</strong></h1>
      <Accordion></Accordion></div>
    
</div>
  );
};
  
export default About;