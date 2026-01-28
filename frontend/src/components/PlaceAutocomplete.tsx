import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface PlaceAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

// Simple list of places for demo
const NEPAL_PLACES = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan",
    "Biratnagar", "Birgunj", "Dharan", "Nepalgunj", "Butwal",
    "Hetauda", "Janakpur", "Dhangadhi", "Itahari", "Nagarkot",
    "Dhulikhel", "Lumbini", "Mustang", "Manang", "Ilam"
];

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ value, onChange, placeholder }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (value.length > 0) {
            const filtered = NEPAL_PLACES.filter(place =>
                place.toLowerCase().includes(value.toLowerCase()) &&
                place.toLowerCase() !== value.toLowerCase()
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [value]);

    return (
        <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => {
                    if (value && suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showSuggestions && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                            onClick={() => onChange(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaceAutocomplete;
