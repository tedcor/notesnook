import React, {createRef} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {opacity, ph, pv, SIZE, WEIGHT} from '../../common/common';
import {getElevation, ToastEvent, db} from '../../utils/utils';
import {eSendEvent} from '../../services/eventManager';
import {eOnNewTopicAdded} from '../../services/events';
import {Toast} from '../Toast';
import {Button} from '../Button';

export class AddTopicDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      titleFocused: false,
    };

    this.title;
    this.titleRef = createRef();
  }

  addNewTopic = async () => {
    if (!this.title)
      return ToastEvent.show('Title is required', 'error', 'local');

    if (!this.props.toEdit) {
      await db.notebooks.notebook(this.props.notebookID).topics.add(this.title);
      //ToastEvent.show('New topic added', 'success');
    } else {
      let topic = this.props.toEdit;
      topic.title = this.title;
      console.log(topic);
      await db.notebooks.notebook(topic.notebookId).topics.add(topic);
    }
    this.close();
    eSendEvent(eOnNewTopicAdded);
  };

  open() {
    this.setState({
      visible: true,
    });
  }
  close() {
    this.title = null;
    this.setState({
      visible: false,
    });
  }

  render() {
    const {visible, titleFocused} = this.state;
    const {colors, toEdit} = this.props;

    return (
      <Modal
        visible={visible}
        animated
        animationType="fade"
        transparent={true}
        onShow={() => {
          this.titleRef.current?.focus();
        }}
        onRequestClose={() => {
          refs = [];
          this.close();
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.close()}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />

          <View
            style={{
              ...getElevation(5),
              width: '80%',
              maxHeight: 350,
              borderRadius: 5,
              backgroundColor: colors.bg,
              paddingHorizontal: ph,
              paddingVertical: pv,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="book-outline" color={colors.accent} size={SIZE.lg} />
              <Text
                style={{
                  color: colors.accent,
                  fontFamily: WEIGHT.bold,
                  marginLeft: 5,
                  fontSize: SIZE.md,
                }}>
                {toEdit ? 'Edit Topic' : 'Add New Topic'}
              </Text>
            </View>

            <TextInput
              ref={this.titleRef}
              style={{
                padding: pv,
                borderWidth: 1.5,
                borderColor: titleFocused ? colors.accent : colors.nav,
                paddingHorizontal: ph,
                borderRadius: 5,
                fontSize: SIZE.sm,
                fontFamily: WEIGHT.regular,
                color: colors.pri,
                marginTop: 20,
              }}
              onFocus={() => {
                this.setState({
                  titleFocused: true,
                });
              }}
              onBlur={() => {
                this.setState({
                  titleFocused: true,
                });
              }}
              defaultValue={toEdit ? toEdit.title : null}
              onChangeText={(value) => {
                this.title = value;
              }}
              placeholder="Enter title of topic"
              placeholderTextColor={colors.icon}
            />

            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <Button
                activeOpacity={opacity}
                onPress={async () => await this.addNewTopic()}
                title={toEdit ? 'Save' : 'Add'}
              />
              <Button
                activeOpacity={opacity}
                onPress={() => this.close()}
                title="Cancel"
              />
            </View>
          </View>
        </View>
        <Toast context="local" />
      </Modal>
    );
  }
}
