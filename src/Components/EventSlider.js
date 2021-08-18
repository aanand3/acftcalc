import React, {useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import './EventSlider.css'


// style for the slider
const useStyles = makeStyles((theme) =>({
}))

export default function EventSlider(props)
{
    const classes = useStyles();
    // value starts at the min
    const [value, setValue] = React.useState(props.min);
    const [score, setScore] = React.useState(0);

    // same as component did mount for obj compo's 
    useEffect(() => {
        grabScoreFromFile();
    });

    // for the slider
    const handleSliderChange = async (event, newValue) =>
    {
         setValue(newValue);
    };

    // for the text field
    const handleInputChange = async (event) =>
    {
        setValue(event.target.value === '' ? '' : Number(event.target.value))
    };

    // handleBlur called when component goes out of focus
    // const handleBlur = async() =>
    // {
    //     if (value < props.min)
    //     {
    //         setValue(props.min);
    //     } else if (value > props.max)
    //     {
    //         setValue(props.max);
    //     }
    // };

    const grabScoreFromFile = async () =>
    {
        // might fail, but if doesnt replace w fileName
        const fileContent = await fetch(props.fileName);
        const text = await fileContent.text();
        console.log('value is ', value)
        var lines = text.split("\n");
        console.log(lines);

        var score = findScore(lines);
        console.log('score is ', score)
        setScore(score);
        //return score;
    }

    function findScore(lines)
    {
        if (value <= props.min)
        {
            return 0;
        } else if (value >= props.max)
        {
            return 100;
        }

        for (let i = 0; i < lines.length-1; i++)
        {
            if (value >= Number(lines[i].split(' ')[0]) && value < Number(lines[i+1].split(' ')[0]))
            {
                return lines[i].split(' ')[1];
            }
        }
    }

    function generateMarks()
    {
        let output = []
        for (let i = props.min ; i < props.max ; i += props.step)
        {
            output.push({ value: i })
        }
        return output;
    }

    return (
        <div className="event-container">
            <h4 className="event-title" >
                {props.eventName}
            </h4>
            <div className="event-slider-container">
                    <ACFTSlider
                        className="event-slider"
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        defaultValue={props.min}
                        valueLabelDisplay="auto"
                        step={props.step}
                        marks={generateMarks()}
                        min={props.min}
                        max={props.max} />
                    <Input
                        className="event-input"
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}

                        inputProps={{
                            step: props.step,
                            min: props.min,
                            max: props.max,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                <h4 className="event-score">
                     {score}
                </h4>
            </div>
        </div>
    );
}

EventSlider.propTypes = {
    eventName: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    fileName: PropTypes.string,
}

var ACFTSlider = withStyles({
    root: {
        color: 'black',
    },
    thumb: {
        height: 16,
        width: 16,
        backgroundColor: '#936e11ec',
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50%)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
    mark: {
        backgroundColor: '#936e11ec',
        height: 2,
        width: 1,
    },
})(Slider);



