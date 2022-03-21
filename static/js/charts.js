function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // console.log(sampleNames);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    targetSample = samples.filter(id => id.id === sample);
    //D3 #1 Create a variable that filters the metadata array for the object with the desired sample number.
    targetMetaData = data.metadata.filter(num => num.id === parseInt(sample));
    // console.log(targetMetaData);
    // console.log(targetSample);
    //  5. Create a variable that holds the first sample in the array.
    var initialSample = targetSample[0];
    // console.log(initialSample);
    // D3 #2. Create a variable that holds the first sample in the metadata array.
    var initialMetaData = targetMetaData[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = targetSample[0].otu_ids;
    // console.log(otuIds);
    var otuLabels = targetSample[0].otu_labels;
    // console.log(otuLabels);
    var sampleValues = targetSample[0].sample_values;
    // console.log(sampleValues);
    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(targetMetaData[0].wfreq);
    // console.log(washingFrequency);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse().map(id => 'OTU ' + id);
    // console.log(yticks); 

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        text:otuLabels.slice(0,10).reverse(),
        type:"bar",
        orientation: 'h',
        marker: {color:"lightseagreen"}
      
      }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Value Counts" }

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);


// Bubble Layout //

  var bubbleData = [
    {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker:
      {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }
  ];

  var bubbleLayout = {
    title:"Bacteria Samples Per Culture",
    xaxis : 
    {
      title : 'OTU ID'
    },
    yaxis: 
    {
      title: "Value Counts"
    }
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  // Gauge Chart //

  


  // 4. Create the trace for the gauge chart.
  var gaugeData = [
    {
      // domain:,
      value: washingFrequency,
      title: {text:"<b>Belly Button Washing Frequency</b><br>Washes Per Week"},
      type:'indicator',
      mode:'gauge+number',
      gauge: {
        bar: {color: "darkslategrey"},
        axis: { 
          nticks: 10,
          range: [null, 10] },
        steps: [
          { range: [0, 2], color: "salmon" },
          { range: [2, 4], color: "lightsalmon" },
          { range: [4, 6], color: "lemonchiffon" },
          { range: [6, 8], color: "lightsteelblue" },
          { range: [8, 10], color: "lightseagreen" },
          ],
        }
      }
    ];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
      width:600, 
      height:450, 
      margin: { t: 0, b: 0 } 
   
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });

};

//   // Bar and Bubble charts
// // Create the buildCharts function.
// function buildCharts(sample) {
//   // Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
//     let samples = data.samples;
//     targetSample = samples.filter(id => id.id === sample);
//     var initialSample = targetSample[0];
//     var otuIds = targetSample[0].otu_ids;
//     var otuLabels = targetSample[0].otu_labels;
//     var sampleValues = targetSample[0].sample_values;

//     var yticks = otuIds.slice(0,10).reverse().map(id => 'OTU ' + id);
//     console.log(yticks); 

//     var barData = [
//       {
//         x: sampleValues.slice(0,10).reverse(),
//         y: yticks,
//         text:otuLabels.slice(0,10).reverse(),
//         type:"bar",
//         orientation: 'h'
      
//       }];
    
//    var barLayout = {
//         title: "Top 10 Bacteria Cultures Found",
//     };

//     // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
//     Plotly.newPlot("bar",barData,barLayout);

//     // 1. Create the trace for the bubble chart.
//     var bubbleData = [
//       {
//         x: otuIds,
//         y: sampleValues,
//         text: otuLabels,
//         mode: "markers",
//         markers:{
//           size:sampleValues,
//         }
//       }
//     ];

//     // 2. Create the layout for the bubble chart.
//     var bubbleLayout = {
//       title:"Bacteria Samples Per Culture",

//     };

//     // 3. Use Plotly to plot the data with the layout.
//     Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
//   });
// }



// };


