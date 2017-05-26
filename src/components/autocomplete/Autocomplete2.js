import React from 'react'

import Autosuggest from 'react-autosuggest'

const languages = [
  {abbr: 'AL', name: 'Alabama'},
  {abbr: 'AK', name: 'Alaska'},
  {abbr: 'AZ', name: 'Arizona'},
  {abbr: 'AR', name: 'Arkansas'},
  {abbr: 'CA', name: 'California'},
  {abbr: 'CO', name: 'Colorado'},
  {abbr: 'CT', name: 'Connecticut'},
  {abbr: 'DE', name: 'Delaware'},
  {abbr: 'FL', name: 'Florida'},
  {abbr: 'GA', name: 'Georgia'},
  {abbr: 'HI', name: 'Hawaii'},
  {abbr: 'ID', name: 'Idaho'},
  {abbr: 'IL', name: 'Illinois'},
  {abbr: 'IN', name: 'Indiana'},
  {abbr: 'IA', name: 'Iowa'},
  {abbr: 'KS', name: 'Kansas'},
  {abbr: 'KY', name: 'Kentucky'},
  {abbr: 'LA', name: 'Louisiana'},
  {abbr: 'ME', name: 'Maine'},
  {abbr: 'MD', name: 'Maryland'},
  {abbr: 'MA', name: 'Massachusetts'},
  {abbr: 'MI', name: 'Michigan'},
  {abbr: 'MN', name: 'Minnesota'},
  {abbr: 'MS', name: 'Mississippi'},
  {abbr: 'MO', name: 'Missouri'},
  {abbr: 'MT', name: 'Montana'},
  {abbr: 'NE', name: 'Nebraska'},
  {abbr: 'NV', name: 'Nevada'},
  {abbr: 'NH', name: 'New Hampshire'},
  {abbr: 'NJ', name: 'New Jersey'},
  {abbr: 'NM', name: 'New Mexico'},
  {abbr: 'NY', name: 'New York'},
  {abbr: 'NC', name: 'North Carolina'},
  {abbr: 'ND', name: 'North Dakota'},
  {abbr: 'OH', name: 'Ohio'},
  {abbr: 'OK', name: 'Oklahoma'},
  {abbr: 'OR', name: 'Oregon'},
  {abbr: 'PA', name: 'Pennsylvania'},
  {abbr: 'RI', name: 'Rhode Island'},
  {abbr: 'SC', name: 'South Carolina'},
  {abbr: 'SD', name: 'South Dakota'},
  {abbr: 'TN', name: 'Tennessee'},
  {abbr: 'TX', name: 'Texas'},
  {abbr: 'UT', name: 'Utah'},
  {abbr: 'VT', name: 'Vermont'},
  {abbr: 'VA', name: 'Virginia'},
  {abbr: 'WA', name: 'Washington'},
  {abbr: 'WV', name: 'West Virginia'},
  {abbr: 'WI', name: 'Wisconsin'},
  {abbr: 'WY', name: 'Wyoming'}
]

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

class AutocompleteExample2 extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
    this.onChange = this.onChange.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
  }

  onChange (event, { newValue }) {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested ({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default AutocompleteExample2
