import classNames from 'classnames';
import { RecoilState, useRecoilState } from 'recoil';
import { useState } from 'react';
import styles from './TaskList.module.css';

export const taskStyle = styles.task;

export interface TaskItemProps {
	key?: any;
	children?: React.ReactNode;
	isCompletedState?: RecoilState<boolean>;
}

function TaskListItem({ children, isCompletedState }: TaskItemProps) {
	const [isCompleted, setIsCompleted] = isCompletedState
		? useRecoilState(isCompletedState)
		: [undefined, undefined];

	return (
		<li
			onClick={() => {
				if (setIsCompleted) setIsCompleted(!isCompleted);
			}}
			className={classNames({ [styles.completed]: isCompleted })}
		>
			{children}
		</li>
	);
}

interface TaskListProps {
	items?: TaskItemProps[];
	act: number;
}

export function TaskList({ items, act }: TaskListProps) {
	const collapseSection = () => {
		setCollapsed(!collapsed);
	};
	const [collapsed, setCollapsed] = useState(false);
	if (items) {
		return (
			<>
				<div
					id={`act-${act}`}
					key={items.length}
					className='header'
					onClick={() => collapseSection()}
				>{`--== Act ${act} ==--`}</div>
				{!collapsed ? (
					<>
						<hr key={items.length + 1} />
						<ol className={classNames(styles.list)}>
							{items &&
								items.map(({ key, ...rest }, i) => (
									<TaskListItem key={key || i} {...rest} />
								))}
						</ol>
					</>
				) : (
					<></>
				)}
				<hr key={items.length + 3} />
				<div />
			</>
		);
	} else return <></>;
}
