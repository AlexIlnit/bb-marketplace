import { useState, useEffect, useRef } from "react";
import { useListingStore } from "../../store/listingStore";


export default function SearchBox() {

  const {
    search,
    setSearch,
    city,
    setCity,
    listings
  } = useListingStore();


  const [value,setValue] = useState(search);
  const [show,setShow] = useState(false);

  const boxRef = useRef(null);



  // закрытие списка
  useEffect(()=>{

    const handler=(e)=>{

      if(
        boxRef.current &&
        !boxRef.current.contains(e.target)
      ){
        setShow(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handler
    );


    return ()=>document.removeEventListener(
      "mousedown",
      handler
    );

  },[]);



  const suggestions =
    value.length > 1
    ?
    listings
      .filter(item =>
        item.title
        .toLowerCase()
        .includes(
          value.toLowerCase()
        )
      )
      .slice(0,5)
    :
    [];



  const selectSuggestion=(title)=>{

    setValue(title);

    setSearch(title);

    setShow(false);

  };



return (

<div
ref={boxRef}
className="
relative
mt-6
max-w-3xl
"
>


<div className="
bg-white
rounded-2xl
p-2
flex
flex-col
md:flex-row
gap-2
shadow-xl
">


<div className="
flex-1
flex
items-center
gap-3
px-4
">

<span>
🔍
</span>


<input

value={value}

onFocus={()=>
 setShow(true)
}

onChange={(e)=>{

 setValue(e.target.value);

}}

placeholder="Что ищете?"

className="
w-full
outline-none
text-gray-800
"

/>

</div>



<div className="
flex
items-center
gap-2
border-l
px-4
text-gray-700
">


<span>
📍
</span>


<input

value={city}

onChange={(e)=>
setCity(e.target.value)
}

placeholder="Город"

className="
w-28
outline-none
"

/>


</div>



<button

onClick={()=>{

setSearch(value);

}}

className="
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-3
rounded-xl
font-semibold
"

>
Найти
</button>


</div>



{
show &&
suggestions.length > 0 && (

<div className="
absolute
top-20
left-0
right-0
bg-white
rounded-2xl
shadow-xl
overflow-hidden
z-50
">


{
suggestions.map(item=>(

<button

key={item._id}

onClick={()=>
selectSuggestion(item.title)
}

className="
w-full
text-left
px-5
py-3
hover:bg-gray-100
text-gray-800
border-b
last:border-none
"

>


<div className="font-medium">
{item.title}
</div>


<div className="
text-xs
text-gray-600
">

{item.city}

</div>


</button>


))
}


</div>

)

}


</div>

);

}