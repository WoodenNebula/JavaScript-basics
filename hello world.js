/*~~~~~~~~~~~~~~~~~~~Basic Introduction~~~~~~~~~~~~~~~~~~~*/
function helloWorld(){
    return "Hello World"
}
console.log(helloWorld())

const showName = () =>{
    let name = "Surab"
    let surname = "Parajuli"
    return(name + " " + surname)
}
console.log("This is " + showName())

/*~~~~~~~~~~~~~~~~~~~Array~~~~~~~~~~~~~~~~~~~*/
const arrayOne = [1, 2, 3, 4, 5]
console.log(arrayOne)

//forEach
arrayOne.forEach(a => {
    console.log(a)
})

//reverse
console.log(arrayOne.reverse())

//Objects in Array
const arrayDetails = [
    {name: "Surab", grade : 'XI', age : 17},
    {name: "Salman", grade : 'XII', age : 16},
    {name: "Oscar", grade : 'XI', age : 15},
    {name: "Somin", grade : 'XII', age : 17}
]

const arrayName = arrayDetails.map(obj => obj.name)
// const <New Array> = <Original_Array>.map() => <Original_Array>.map(element => element.<targeted_object>)
console.log(arrayName)

/*~~~~~~~~~~~~~~~~~~~ASSIGNMENT~~~~~~~~~~~~~~~~~~~*/
 
const arrayResult = [ //original Array
    {term: "First", physics: 93, chemistry: 85, english: 80, nepali: 90, maths: 85, computer: 90},
    {term: "Second", physics: 83, chemistry: 88, english: 88, nepali: 93, maths: 95, computer: 94},
    {term: "Third", physics: 91, chemistry: 90, english: 90, nepali: 93, maths: 99, computer: 95}
]

const arrayPhysics = arrayResult.map(marks => marks.physics)
console.log(arrayPhysics)

const arrayComputer = arrayResult.map(marks => marks.chemistry)
console.log(arrayComputer)