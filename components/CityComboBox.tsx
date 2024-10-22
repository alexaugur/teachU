
 import { useState } from "react"
 import { Check, ChevronsUpDown } from "lucide-react"
  
 import { cn } from "@/lib/utils"
 import { Button } from "@/components/ui/button"
 import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
 } from "@/components/ui/command"
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover"
  
 import { cityJson } from './all-us-cities';
import { useStore } from "@/lib/store"

  
 export default function CityComboboxDemo() {
     const [open, setOpen] = useState(false)
     const [value, setValue] = useState("")
     const setCity = useStore((state) => state.setCity);
     const state = useStore((state) => state.state);

     const frameworks = cityJson[state];
     return (
       <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
           <Button
             variant="outline"
             role="combobox"
             aria-expanded={open}
             className="w-[200px] justify-between"
           >
             {value
               ? frameworks && frameworks.find((framework) => framework === value)
               : "Select City"}
             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[200px] p-0">
           <Command>
             <CommandInput placeholder="Select City" />
             <CommandEmpty>No City Found.</CommandEmpty>
             <CommandGroup>
                 <CommandList>
               {frameworks && frameworks.map((framework) => (
                 <CommandItem
                   key={framework}
                   value={framework}
                   onSelect={(currentValue) => {
                     setValue(currentValue === value ? "" : currentValue)
                     setCity(currentValue === value ? "" : currentValue)
                     setOpen(false)
                   }}
                 >
                   <Check
                     className={cn(
                       "mr-2 h-4 w-4",
                       value === framework ? "opacity-100" : "opacity-0"
                     )}
                   />
                   {framework}
                 </CommandItem>
               ))}
               </CommandList>
             </CommandGroup>
           </Command>
         </PopoverContent>
       </Popover>
     )
 }
 
 