import React from 'react';

interface Props {
    title: String;
}

const header: React.FC<{title: String}> = (props: Props) => {
    return (
        <div>
            <h1>{props.title}</h1>
        </div>
    );
}

export default header;