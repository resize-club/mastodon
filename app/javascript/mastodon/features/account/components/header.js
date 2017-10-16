import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Avatar from '../../../components/avatar';
import ImmutablePureComponent from 'react-immutable-pure-component';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
});

@injectIntl
export default class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    me: PropTypes.number.isRequired,
    onFollow: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { account, me, intl } = this.props;

    if (!account) {
      return null;
    }

    let info        = '';
    let actionBtn   = '';
    let lockedIcon  = '';

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info = <span className='account--follows-info'><FormattedMessage id='account.follows_you' defaultMessage='Follows you' /></span>;
    }

    if (me !== account.get('id')) {
      if (account.getIn(['relationship', 'requested'])) {
        actionBtn = (
          <div className='account--action-button'>
            <IconButton size={26} active icon='hourglass' title={intl.formatMessage(messages.requested)} onClick={this.props.onFollow} />
          </div>
        );
      } else if (!account.getIn(['relationship', 'blocking'])) {
        actionBtn = (
          <div className='account--action-button'>
            <IconButton size={26} icon={account.getIn(['relationship', 'following']) ? 'user-times' : 'user-plus'} active={account.getIn(['relationship', 'following'])} title={intl.formatMessage(account.getIn(['relationship', 'following']) ? messages.unfollow : messages.follow)} onClick={this.props.onFollow} />
          </div>
        );
      }
    }

    if (account.get('locked')) {
      lockedIcon = <i className='fa fa-lock' />;
    }

    const content         = { __html: account.get('note_emojified') };
    const displayNameHtml = { __html: account.get('display_name_html') };

    return (
      <div className='account__header' style={{ backgroundImage: `url(${account.get('header')})` }}>
        <div>
          <a href={account.get('url')} target='_blank' rel='noopener'>
            <span className='account__header__avatar'><Avatar account={account} animate size={90} /></span>
            <span className='account__header__display-name' dangerouslySetInnerHTML={displayNameHtml} />
          </a>
          <span className='account__header__username'>@{account.get('acct')} {lockedIcon}</span>
          <div className='account__header__content' dangerouslySetInnerHTML={content} />

          {info}
          {actionBtn}
        </div>
      </div>
    );
  }

}
