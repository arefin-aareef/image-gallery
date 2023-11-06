

import { useState } from 'react';
import { data } from './data';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	hasSortableData,
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS, hasViewportRelativeCoordinates } from '@dnd-kit/utilities';
import {
  border,
	Box,
	Button,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Heading,
	Image,
	Input,
	Text,
} from '@chakra-ui/react';
import { BsImage } from 'react-icons/bs';



const ImageCard = ({ user, ...props }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: user.id });
	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};
	return (
		<GridItem
			borderRadius='6px'
			border='1px solid'
			borderColor='gray.400'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			{...props}
			position='relative'
			_hover={{
				'&::after': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: '#000',
					opacity: 0.2,
					transition: 'opacity 0.3s',
					zIndex: '1',
				},
			}}
			_hoverAfter={{
				opacity: 1,
			}}
		>
			<Checkbox
				onClick={() => handleImageClick(id)}
				colorScheme='blue'
				position='absolute'
				top='10px'
				left='10px'
				size='lg'
				borderRadius='6px'
				zIndex='2'
			></Checkbox>
			<Image
				src={user.image}
				objectFit='cover'
			/>
		</GridItem>
	);
};

const Gallery = () => {
	const [users, setUsers] = useState(data);
    const [selectedImages, setSelectedImages] = useState([]);

	const addUser = () => {
		newUser = {
			id: Date.now().toString(),
			name: inputValue,
		};
		setInputValue('');
		setUsers(users => [...users, newUser]);
	};

	const onDragEnd = event => {
		const { active, over } = event;
		if (active.id === over.id) {
			return;
		}
		setUsers(users => {
			const oldIndex = users.findIndex(user => user.id === active.id);
			const newIndex = users.findIndex(user => user.id === over.id);
			return arrayMove(users, oldIndex, newIndex);
		});
	};

    function handleImageClick(id) {
			const selectedIndex = selectedImages.indexOf(id);
      console.log('selected', selectedIndex)
			if (selectedIndex === -1) {
				setSelectedImages([...selectedImages, id]);
			} else {
				const newSelectedImages = [...selectedImages];
				newSelectedImages.splice(selectedIndex, 1);
				setSelectedImages(newSelectedImages);
			}
		}

      function handleDeleteSelected() {
				const remainingImages = users.filter(
					user => !selectedImages.includes(user.id)
				);
				setUsers(remainingImages);
				setSelectedImages([]);
			}

	return (
		<Flex
			direction='column'
			w='60%'
			justifyContent='center'
			alignItems='center'
			flexWrap='wrap'
			mx='auto'
			minH='100vh'
			gap='8px'
		>
			<Flex w='full' justify='space-between' px='20px' alignItems='center'>
				<Heading>Gallery</Heading>
				{selectedImages.length === 0 && (
					<Box >
						<Button onClick={handleDeleteSelected}>
							Delete {selectedImages.length <= 1 ? 'file' : 'files'}
						</Button>
					</Box>
				)}
			</Flex>
			<Grid
				templateColumns='1fr 1fr 1fr 1fr 1fr'
				templateRows='1fr 1fr 1fr'
				gap='8px'
			>
				<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
					<SortableContext
						items={users}
						strategy={horizontalListSortingStrategy}
					>
						{users.map((user, index) => {
							const isSelected = selectedImages.includes(user.id);
							return (
								<>
									<ImageCard
										{...(isSelected ? (border = '2px solid blue') : '')}
										colSpan={index === 0 ? 2 : 1}
										rowSpan={index === 0 ? 2 : 1}
										key={user.id}
										user={user}
										handleImageClick={handleImageClick}
										onClick={() => handleImageClick(user.id)}
									/>
								</>
							);
						})}
						<GridItem
							borderRadius='6px'
							border='1px solid'
							borderColor='gray.400'
							justifyContent='center'
							alignItems='center'
							cursor='pointer'
							userSelect='none'
						>
							<Flex
								direction={'column'}
								justifyContent='center'
								alignItems='center'
								h='100%'
								gap='10px'
							>
								<BsImage />
								<Text>Add Images</Text>
							</Flex>
						</GridItem>
					</SortableContext>
				</DndContext>
			</Grid>
		</Flex>
	);
};
export default Gallery;