var processes;
var resources;
var whichInput=0;
var data;
var alloc=[[]];
var max = [[]];
var available=[];
//testing values
// alloc=[[0,1,0],
// [2,0,0],
// [3,0,2],
// [2,1,1],
// [0,0,2]
// ];

// max=[[7,5,3],
// [3,2,2],
// [9,0,2],
// [2,2,2],
// [4,3,3]
// ];

// available=[
//     3,3,2
// ];



//get number of inputs
$( "#initial-submit" ).submit(function( event ) {
     data= $( this ).serializeArray();
    event.preventDefault();
    if(whichInput===0){
    processes=data[0].value;
    resources=data[1].value;
    createInputs();
    whichInput=1;
    }else{
        this.remove();
        showSafeSeq();
    }
  });


//create inputs
function createInputs(){
    var form = document.getElementById('initial-submit');
    while (form.hasChildNodes()) {
        form.removeChild(form.lastChild);
    }

    for (i=0;i<processes;i++){
        // Append a node with a random text
        var div = document.createElement('div');
        div.classList.add('form-group');
        div.classList.add('div-con');
        var p = document.createElement('p');
        p.innerText='Process '+(i);
        p.classList.add('text-info');
        div.appendChild(p);

        //Alloc div
        var allocDiv = document.createElement('div');
        allocDiv.classList.add('form-group');
        // divl.classList.add('div-con');

        //MAX div
        var maxDiv = document.createElement('div');
        maxDiv.classList.add('form-group');
        // divr.classList.add('div-con');

        // Create an <input> element, set its type and name attributes
        for(j=0;j<resources;j++){

        //Alloc input
        var allocLabel = document.createElement('label');
        allocLabel.innerText=String.fromCharCode(65+j)+" Alloc";
        var allocInput = document.createElement("input");
        allocInput.type = "number";
        allocInput.name = "alloc" + i;
        allocInput.classList.add('form-control')

        //MAX input
        var maxLabel = document.createElement('label');
        maxLabel.innerText=String.fromCharCode(65+j)+" MAX";
        var maxInput = document.createElement("input");
        maxInput.type = "number";
        maxInput.name = "max" + i;
        maxInput.classList.add('form-control')

        allocDiv.appendChild(allocLabel);
        allocDiv.appendChild(allocInput);
        maxDiv.appendChild(maxLabel);
        maxDiv.appendChild(maxInput);
        div.appendChild(allocDiv);
        div.appendChild(maxDiv);
        // Append a line break 
        }
        form.appendChild(div);
    }

    var availableDiv = document.createElement('div');
        availableDiv.classList.add('form-group');
        availableDiv.classList.add('avail-con');
        var p = document.createElement('p');
            p.innerText='Availble Resources';
            p.classList.add('text-info');
        availableDiv.appendChild(p);
        for(j=0;j<resources;j++){
        var availLabel = document.createElement('label');
        availLabel.innerText=String.fromCharCode(65+j);
        var availInput = document.createElement("input");
        availInput.type = "number";
        availInput.name = "avail" + j;
        availInput.classList.add('form-control')
        availableDiv.appendChild(availLabel);
        availableDiv.appendChild(availInput);
        }
        form.appendChild(availableDiv);

    var btn = document.createElement("button");
        btn.type='submit';
        btn.innerText='submit';
        btn.classList.add('btn');
        btn.classList.add('btn-primary');
        form.appendChild(btn);


}


function formatInput(){
    let swap =0;
    let count=0;
    let temp=[];
    for(i=0;i<(data.length)-resources;i++){
        // console.log(data[i].value);
        temp.push(parseInt(data[i].value));
        count++;
        if(count>=resources){
            count=0;
            if(swap==0){
            alloc.push(temp);
            swap=1;
            } else{
                max.push(temp);
                swap=0;
            }
            temp=[]
        }
    }

    max.shift();
    alloc.shift();

    available=data.slice(1).slice(-resources);
    for(i=0;i<available.length;i++){
        available[i]=parseInt(available[i].value);
    }


}


function calculateNeed(){
    let need=[];
    for (i=0;i<processes;i++){
        // #temp list to hold needed values before appending to the need list
        tempList=[];
        for(j=0;j<resources;j++){
            tempList.push(max[i][j]-alloc[i][j]);
        }
        need.push(tempList);
    }
    return need;

}

function safeSeq(){
    
   formatInput();

    //Resources needed for each process
    let need=[]
    need=calculateNeed();

    // #finished processes initialized all to false
    let finished=[];
    finished.length=processes;
    finished.fill(false);

    console.log(alloc);
    console.log(max);
    console.log(need);
    console.log(available);
    

    // #safe seq
    let safe=[];
    console.log(safe);

    // #boolean to check if any process was allocated
    // #if no process is allocated then system is in deadlock or safesequence was found
   var allocated = true;

    while(allocated == true){
        allocated=false;
        for (i=0;i<processes;i++){
            if (finished[i] == false){
                // #boolean run to check if needed resources are less than or equal to available
                 let run=true;
                for(j=0;j<resources;j++){
                    if (need[i][j] > available[j]){
                        run=false;
                        break;
                    }
                }
                if (run == true) {
                        allocated=true;
                        finished[i]=true;
                        safe.push(i);
                        for(j=0;j<resources;j++){
                            available[j]=available[j]+alloc[i][j];
                        }
                    }
            }
        }
    }

    console.log(safe);
    console.log(available);

    return safe;
}

function showSafeSeq(){
    safe=safeSeq();
    var outputDiv= document.createElement('div');
    outputDiv.classList.add('alert');
    var output = document.createElement('strong');
    if(safe.length != processes){
        outputDiv.classList.add('alert-danger');
        output.innerText='No safe sequence Found ! System is in a Dead Lock'
    }else{
        var text='';
        for(i=0;i<safe.length;i++){
            text+="P"+safe[i]+" ";
        }
       outputDiv.classList.add('alert-success');
       output.innerText='The Safe sequence is: '+text;
    }
    
   outputDiv.appendChild(output);
   var refreshButton = document.createElement('button');
   refreshButton.classList.add('btn');
   refreshButton.classList.add('btn-primary');
   refreshButton.classList.add('btn-lg');
   refreshButton.classList.add('btn-block');
   refreshButton.innerText="Retry";
   refreshButton.addEventListener('click',function(){
       location.reload();
   });
   var container = document.getElementsByClassName('container')[0];
   container.appendChild(outputDiv);
   container.appendChild(refreshButton);
}

