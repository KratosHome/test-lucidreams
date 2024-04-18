import axios from "axios";
import { useQuery } from "react-query";
import Select from "react-select";
import { useState } from "react";
interface Item {
    id: string;
    name: string;
    category: string;
    value: number;
}


async function fetchData() {
    const { data } = await axios.get<Item[]>(`${process.env.REACT_APP_API_URL}/autocomplete`);
    return data;
}

function App() {
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const { data, isLoading, isError } = useQuery<Item[], Error>("data", fetchData);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data.</div>;

    const options = data ? data.map(item => ({
        value: item.id,
        label: `${item.name} (${item.category})`,
        numberValue: typeof item.value === 'number' ? item.value : eval(item.value)
    })) : [];

    const handleTypeSelect = (options: any) => {
        setSelectedOptions(options || []);
    };


    const getTotalValueSum = () => {
        return selectedOptions.reduce((acc, option) => acc + option.numberValue, 0);
    };

    return (
        <div className="container">
            <Select
                options={options}
                onChange={handleTypeSelect}
                value={selectedOptions}
                isMulti
                placeholder="Select options"
            />
            <div className="result">
                <strong>Total Value Sum:</strong> {getTotalValueSum()}
            </div>
        </div>
    );
}

export default App;
