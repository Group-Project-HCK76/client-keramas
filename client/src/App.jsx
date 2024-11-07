// App.jsx
import { RouterProvider } from "react-router-dom";
import { CardProvider } from './contexts/CardContext'; 
import router from "./router";

function App() {
  return (
    <CardProvider>  
      <RouterProvider router={router} />
    </CardProvider>
  );
}

export default App;