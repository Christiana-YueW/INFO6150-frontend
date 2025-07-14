import panelData from '../data/panels.js';
import Panel from '../components/Panel';

function PanelsPage() {
    return (
        <section>
            <h2> Panel Content </h2>
            {panelData.map((panel, index) => (
                <Panel key={index} {...panel} />
            ))}

        </section>

    )
}

export default PanelsPage;