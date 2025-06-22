import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataEntryWithAI from "./data_entry_with_AI/DataEntryWithAI";
import ORC from "./orc/ORC";


export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataEntryWithAI />} />
        <Route path="/orc" element={<ORC />} />
      </Routes>
    </Router>
  );
};

export default App;
