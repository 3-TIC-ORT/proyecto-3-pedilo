import {auth} from "@/auth"
import { getTables } from "@/actions/tables";

export default async function Calls(){
  const session = await auth();
const user = session?.user;
const role = session?.user.role;

if(!session){
  return(
    <div>not authenticated</div>
  );
}else if(role != "waiter"){
return(
  <div>You have to be a Waiter to access this page</div>
);
}
else{
  const items = getTables();
  console.log(items);
  return(
    <div>Hola mozo</div>
  );
}
}
