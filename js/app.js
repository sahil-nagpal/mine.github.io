document.addEventListener("DOMContentLoaded",()=>{
    const grid = document.querySelector(".grid")
    let width = 10
    let squares = []
    let imageWidth = "35px"
    let gameOver = false
    let bombAmount = 20
    let total = bombAmount
    let resultTitle = document.querySelector(".result")
    let score = document.querySelector("#scores")
    let pointsChecked = []
    let flaggedSquares = []
    createBoard()
    updateScore()
    function updateScore(){
        score.innerHTML = total
    }
    function lost(){
        gameOver = true
        resultTitle.innerHTML = "You lose"
        setTimeout(()=>{
            createBoard()
        },2000)
    }
    function createBoard(){
        resultTitle.innerHTML = ""
        grid.innerHTML = ""
        gameOver = false
        flaggedSquares = []
        let bombs = Array(bombAmount).fill("bomb")
        let validNumbers = Array(width*width - bombAmount).fill("valid")
        let combinedNumbers = bombs.concat(validNumbers)
        let shuffledGameBoard = combinedNumbers.sort(()=>(Math.random() - 0.5))
        for(i=0;i<width*width;i++){
            let square = document.createElement("div")
            square.id = i
            square.addEventListener("click",(e)=>{
                checkForPoint(square)
            })
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
              }
            
            square.setAttribute("class",shuffledGameBoard[i])
            grid.appendChild(square)
            squares.push(square)
        }
    }

    function emptySquares(squares){
        squares.forEach(box => {
            checkForPoint(box)
        });
        
    }
    function showAllBombs(){
        squares.forEach((square)=>{
            if(square.className === "bomb"){
                let image = "💣"
                let bg ="red"
                square.innerHTML = image
                square.className += " "+ bg
                square.style.backgroundSize = "0%"
            }
        })
    }

    function addFlag(square){
        if(total === 0){
            // checkForWinOrLose()
            return
        }
        if((Array.from(square.classList.values())).includes("touched")) return;
        if(!(Array.from(square.classList.values())).includes("flagged")){
            square.innerHTML = "🚩"
            square.className += " flagged"
            total = total - 1
        }
        else{
            square.classList.remove("flagged")
            square.innerHTML = ""
            console.log(total)
            total = total+ 1
            
        }
        flaggedSquares.push(square)
        
        updateScore()
        
    }

    function checkForPoint(square){
        if(gameOver) return
        let selectedBoxClass = square.className
        let selectedBoxId = parseInt(square.id)
        let isLeftEdge = selectedBoxId % width === 0
        let isRightEdge = selectedBoxId % width === 9
        let numbers = [(!isLeftEdge && selectedBoxId-1),(!isRightEdge && selectedBoxId+1),(selectedBoxId+10),(selectedBoxId-10),( !isLeftEdge &&  selectedBoxId+10 -1 ),(!isRightEdge && selectedBoxId+10 +1),(!isRightEdge && selectedBoxId-10+1), ( !isLeftEdge && selectedBoxId-10-1)].filter(item => item!= false && item >= 0)
        let squaresAround = squares.filter(item => (numbers.includes(parseInt(item.id) ) ))
        let boxesAround = squaresAround.map(item => item.className)
        
        let image;
        let bg = "white"
        let bombsAround = boxesAround.filter(item => item === "bomb").length
        if(selectedBoxClass === "bomb"){
            image = "💣"
            bg ="red"
            square.className += " "+ bg
            lost()
            square.style.backgroundSize = "0%"
            showAllBombs()
            
        }
        else{
            image = bombsAround ||  ""
            bg = `url("https://minesweeper.online/img/skins/hd/type0.svg?v=3")`
            square.style.backgroundImage = bg
        }
        square.innerHTML = image
        square.className = " touched"
        pointsChecked.push(selectedBoxId)
        if(!bombsAround && selectedBoxClass != "bomb"){
            emptySquares(squaresAround.filter(item => !pointsChecked.includes(+item.id)))
        }
    }
})

