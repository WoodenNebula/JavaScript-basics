// function helloWorld(){
//     return "Hello World"
// }
// console.log(helloWorld())

// const showName = () =>{
//     let name = "Surab"
//     let surname = "Parajuli"
//     return(name + " " + surname)
// }
// console.log("This is " + showName())

/*~~~~~~~~~Array~~~~~~~~~*/
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