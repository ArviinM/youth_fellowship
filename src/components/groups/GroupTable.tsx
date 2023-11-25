import {useGroups} from "../../hooks/attendees/useGroups.ts";
import {useGroupStore} from "../../store/groupStore.ts";
import {Group} from "../../types/Group.ts";

const GroupTable = () => {
    const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);
    const activeGroup = useGroupStore((state) => state.activeGroup);
    const setActiveGroup = useGroupStore((state) => state.setActiveGroup);


    const {isPending, isError, data, error} = useGroups();
    if (isPending) {
        return (<div>Loading...</div>)
    }
    if (isError && error) {
        return (<div>There's something wrong: {error?.message}</div>)
    }
    if (!data) {
        return (<div>No data available</div>)
    }

    const handleRowClick = (group: Group) => {
        setSelectedGroup(group);
        if (group.id !== undefined) {
            setActiveGroup(group.id);
        }
    }

    return (
        <table className="table -z-50">
            <thead className="">
            <tr>
                <th scope="col"
                    className="uppercase tracking-wider font-medium">
                    Name
                </th>
                <th scope="col"
                    className="uppercase tracking-wider font-medium">
                    Score
                </th>
            </tr>
            </thead>
            <tbody className="">
            {data.map((group) => (
                <tr key={group.id}
                    className={`hover ${activeGroup === group.id ? 'bg-base-200' : ''}`}
                    onClick={() => handleRowClick(group)}>
                    <td className="">
                        <div className="">{group.name} </div>
                    </td>
                    <td className="">
                        <div className="">{group.score}</div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default GroupTable
