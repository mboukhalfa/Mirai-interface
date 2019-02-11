export class NetworkVis {
    /*==== VIS ====*/
    static options: any = {
        autoResize: true,
        height: '100%',
        width: '100%',
        interaction: { hover: true },
        groups: {
            container: {
                color: {
                    border: '#2680eb', background: '#2680eb', highlight: '#e10b0b',
                    hover: { border: 'rgba(51,68,95,0.5)', background: '#2680eb' }
                },
            },
            iaas: {
                shape: 'circle',
                color: {
                    cursor: 'pointer',
                    border: 'orange', background: 'orange', highlight: '#e10b0b',
                    hover: { border: 'rgba(51,68,95,0.5)', background: 'orange' },

                },
            },


        },
        nodes: {

            shape: 'dot',
            size: 16,
            font: {
                size: 13,
                color: '#ffffff'
            },

        },
        edges: {

        }

    };

}