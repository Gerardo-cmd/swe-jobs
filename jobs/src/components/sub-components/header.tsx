import React from 'react';

interface HeaderProps {
    title: String;
}

const header: React.FC<{title: String}> = (props: HeaderProps) => {
    return (
        <div>
            <h1>{props.title}</h1>
        </div>
    );
}

export default header;