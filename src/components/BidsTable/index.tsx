import { Divider } from "@mantine/core";
import React, { Fragment, useEffect, useState } from "react";
import "./style.scss";

export default function BidsTable(props:any) {
	
	const [user, setUser] = useState<any>({username: null});
	
	useEffect(() => {
		setUser(props.user)
		// console.log(props.user)
	}, [])
	
	// console.log(props.user)
	// if (props.user == null) {
	// 	// setUser({
	// 	// 	username: "xabalababilambau"
	// 	// })
	// } else {
	// 	setUser(props.user)
	// }
	
	return <div className="bids-table dark">
		
		{
			props.bids.length > 0 ? 
			
			<div className="bids-table-header">
				<div>#</div>
				<div>Name</div>
				<div>Bid</div>
			</div>
			:null
		}
		
		{
			props.bids.length > 0 ? 
			
			
			
			props.bids.map((bid:any, index:number) => {
				
				// let hasMe = false;
				// if (user != null && bid.userName == user.username) {
				// 	// props.hasMe();
				// 	// hasMe = true;
				// }
				
				return (
					<Fragment key={index}>
						
						<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
						<div className={ bid.me == true ? "bids-table-row me" : "bids-table-row" }>
							<div>
								{bid.position}
							</div>
							<div>
								<div>{bid.userName}</div>
							</div>
							<div>{bid.value}</div>
						</div>
						
					</Fragment>
				)
				
			})
			
			: null
		}
		
		{/* <div className="bids-table-header">
			<div>#</div>
			<div>Name</div>
			<div>Bid</div>
		</div>
		<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
		<div className="bids-table-row">
			<div>
				1
			</div>
			<div>
				<div>Papa figo biro liro liro liro liro</div>
			</div>
			<div>1.4</div>
		</div>
		<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
		<div className="bids-table-row me">
			<div>
				2
			</div>
			<div>
				<div>Perebas</div>
			</div>
			<div>1.2</div>
		</div>
		<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
		<div className="bids-table-row">
			<div>
				3
			</div>
			<div>
				<div>Firula</div>
			</div>
			<div>1.0</div>
		</div>
		<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
		<div className="bids-table-row">
			<div>
				4
			</div>
			<div>
				<div>Proerd</div>
				
			</div>
			<div>0.8</div>
		</div>
		<Divider className="custom-divider" my="xs" variant="dashed" size={1} />
		<div className="bids-table-row">
			<div>
				5
			</div>
			<div>
				<div>Xico</div>
				
			</div>
			<div>0.6</div>
		</div> */}
		
	</div>;
}
